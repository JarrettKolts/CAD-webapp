export function handleFileUpload(
  options: { accept?: string; multiple?: boolean } = {}
): Promise<File | File[] | null> {
  const { accept = "*", multiple = false } = options;

  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;
    input.style.display = "none";

    input.onchange = () => {
      if (multiple) {
        resolve(input.files ? Array.from(input.files) : null);
      } else {
        resolve(input.files?.[0] || null);
      }
      input.remove();
    };

    document.body.appendChild(input);
    input.click();
  });
}
