// Utility to split response string into sections based on numbered pattern
function splitResponseSections(text: string): string[] {
  // Split before each number-dot pattern, but keep the delimiter
  return text.split(/(?=\n?\d+\. )/g).map(s => s.trim()).filter(Boolean);
}

function createMapURL(text:string): string {
    // const match = text.match(/- Address: (.*?)(?:\\n|$)/);
    const match = text.match(/Address:\s*(.*)$/m);
    const address = match ? match[1].trim() : ""; 
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    return mapsUrl;
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
                return <p key={i} className="whitespace-pre-line border-b-2 border-orange-400 p-4">
                    {section}
                    {i ? (
                        <>&nbsp;<a href={createMapURL(section)} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View on Google Maps</a></>
                    ) : null}
                </p>
            }
        )
      }
    </div>


  );
}
