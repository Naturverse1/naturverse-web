-- P2P transfer support

-- unique indexes for users
create unique index if not exists users_email_unique on public.users (lower(email));
create unique index if not exists users_username_unique on public.users (lower(username));

-- ensure wallet helper
create or replace function public.ensure_wallet(p_user_id uuid)
returns uuid
language plpgsql
security definer
as $$
declare
  wid uuid;
begin
  select id into wid from public.wallets where user_id = p_user_id;
  if wid is null then
    insert into public.wallets (user_id) values (p_user_id)
    returning id into wid;
  end if;
  return wid;
end;
$$;

-- atomic transfer function
create or replace function public.natur_transfer(
  p_sender_user_id uuid,
  p_recipient text,
  p_amount int,
  p_note text default null
)
returns table(sender_balance int, recipient_balance int)
language plpgsql
security definer
as $$
declare
  v_sender_wallet uuid;
  v_recipient_user uuid;
  v_recipient_wallet uuid;
  v_clean text := trim(p_recipient);
  v_is_handle boolean := left(trim(p_recipient),1)='@';
begin
  if p_amount is null or p_amount <= 0 then
    raise exception 'Amount must be > 0';
  end if;

  -- resolve recipient by email or @handle (case-insensitive)
  if v_is_handle then
    select id into v_recipient_user
    from public.users
    where lower(username) = lower(substring(v_clean from 2));
  else
    select id into v_recipient_user
    from public.users
    where lower(email) = lower(v_clean);
  end if;

  if v_recipient_user is null then
    raise exception 'Recipient not found';
  end if;

  if v_recipient_user = p_sender_user_id then
    raise exception 'Cannot send to yourself';
  end if;

  -- wallets
  v_sender_wallet    := public.ensure_wallet(p_sender_user_id);
  v_recipient_wallet := public.ensure_wallet(v_recipient_user);

  -- atomic block
  perform pg_advisory_xact_lock( hashtextextended('natur_transfer',0) );

  -- check funds
  if (select balance from public.wallets where id = v_sender_wallet for update) < p_amount then
    raise exception 'Insufficient balance';
  end if;

  -- write txns (triggers update balances)
  insert into public.wallet_txns (user_id, wallet_id, type, amount, note)
    values (p_sender_user_id, v_sender_wallet, 'spend', p_amount, coalesce(p_note,'send'));

  insert into public.wallet_txns (user_id, wallet_id, type, amount, note)
    values (v_recipient_user, v_recipient_wallet, 'grant', p_amount, coalesce(p_note,'receive'));

  -- return new balances
  return query
  select s.balance, r.balance
  from public.wallets s, public.wallets r
  where s.id = v_sender_wallet and r.id = v_recipient_wallet;
end;
$$;

revoke all on function public.natur_transfer(uuid,text,int,text) from public;
grant execute on function public.natur_transfer(uuid,text,int,text) to authenticated;
