// Utility to split response string into sections based on numbered pattern
function splitResponseSections(text: string): string[] {
  // Split before each number-dot pattern, but keep the delimiter
  return text.split(/(?=\n?\d+\. )/g).map(s => s.trim()).filter(Boolean);
}

interface ResponseUIProps {
  response: string;
}

export default function ResponseUI({ response }: ResponseUIProps) {
  if (!response) return null;
  const sections = splitResponseSections(response);
  console.log(sections.length);
  return (
    <div className="space-y-4">
      {
        sections.map(
            (section, i) => {
                return <p key={i} className="whitespace-pre-line">{section}</p>
            }
        )
      }
    </div>


  );
}
