export default function Text({ content } : { content: string }) {
  return <p className="text-2xl text-center font-semibold text-primary">{content}</p>
}