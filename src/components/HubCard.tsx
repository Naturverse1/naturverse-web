type Hub = {
  image: string;
  name: string;
  subtitle: string;
  href?: string;
};

export function HubCard({ hub }: { hub: Hub }) {
  const Wrapper: any = hub.href ? 'a' : 'div';
  const wrapperProps = hub.href ? { href: hub.href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="block overflow-hidden rounded-xl border bg-white"
    >
      <img
        src={hub.image}
        alt={hub.name}
        className="w-full max-w-full h-auto object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{hub.name}</h3>
        <p className="mt-1 text-sm text-gray-700">{hub.subtitle}</p>
      </div>
    </Wrapper>
  );
}

export default HubCard;

