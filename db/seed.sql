-- seed tokens row (balance 42 for demo)
insert into user_tokens (device_id, balance)
values ('DEMO', 42)
on conflict (device_id) do nothing;

-- a couple of content rows
insert into content (type, title, slug, body, meta) values
('story','The Seed That Could','the-seed-that-could',
 'A curious seed travels the Naturverse learning how to sprout.',
 '{"zone":"Stories","level":"K-2"}'),
('quiz','Seed Knowledge Check','seed-knowledge',
 '','{"zone":"Quizzes"}'),
('tip','Mindful Breath','mindful-breath','Try 3 slow breaths and notice a color around you.','{"zone":"Tips"}')
on conflict (slug) do nothing;

-- attach a quiz
insert into quizzes (content_id, questions)
select id,
'[
  {"q":"What does a seed need to sprout?","choices":["Sun","Water","Soil","All of the above"],"answer":3}
]'::jsonb
from content where slug='seed-knowledge';
