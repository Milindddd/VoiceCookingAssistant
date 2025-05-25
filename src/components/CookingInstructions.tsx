interface CookingInstructionsProps {
  instructions: string[];
}

export function CookingInstructions({
  instructions,
}: CookingInstructionsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Cooking Instructions
      </h2>
      <ol className="list-decimal list-inside space-y-2">
        {instructions.map((instruction, index) => (
          <li key={index} className="text-gray-700">
            {instruction}
          </li>
        ))}
      </ol>
    </div>
  );
}
