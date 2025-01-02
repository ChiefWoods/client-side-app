export default function Text({ content }: { content: string }) {
  return (
    <p className="text-center text-2xl font-semibold text-primary">{content}</p>
  );
}
