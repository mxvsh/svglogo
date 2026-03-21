export type CodeFramework = "react" | "vue" | "svelte";

export function svgToCode(svg: string, framework: CodeFramework): string {
  switch (framework) {
    case "react":
      return svgToReact(svg);
    case "vue":
      return svgToVue(svg);
    case "svelte":
      return svgToSvelte(svg);
  }
}

function svgToReact(svg: string): string {
  const jsx = svg
    .replace(/class="/g, 'className="')
    .replace(/clip-path="/g, 'clipPath="')
    .replace(/clip-rule="/g, 'clipRule="')
    .replace(/fill-opacity="/g, 'fillOpacity="')
    .replace(/fill-rule="/g, 'fillRule="')
    .replace(/font-family="/g, 'fontFamily="')
    .replace(/font-size="/g, 'fontSize="')
    .replace(/font-weight="/g, 'fontWeight="')
    .replace(/stroke-dasharray="/g, 'strokeDasharray="')
    .replace(/stroke-dashoffset="/g, 'strokeDashoffset="')
    .replace(/stroke-linecap="/g, 'strokeLinecap="')
    .replace(/stroke-linejoin="/g, 'strokeLinejoin="')
    .replace(/stroke-miterlimit="/g, 'strokeMiterlimit="')
    .replace(/stroke-opacity="/g, 'strokeOpacity="')
    .replace(/stroke-width="/g, 'strokeWidth="')
    .replace(/stop-color="/g, 'stopColor="')
    .replace(/stop-opacity="/g, 'stopOpacity="')
    .replace(/text-anchor="/g, 'textAnchor="')
    .replace(/text-decoration="/g, 'textDecoration="')
    .replace(/dominant-baseline="/g, 'dominantBaseline="');

  return `export default function Logo(props) {\n  return (\n    ${jsx.replace(/^<svg/, "<svg {...props}")}\n  );\n}`;
}

function svgToVue(svg: string): string {
  return `<template>\n  ${svg}\n</template>`;
}

function svgToSvelte(svg: string): string {
  return svg;
}
