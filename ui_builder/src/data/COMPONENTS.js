export const COMPONENTS = [
  {
    type: "button",
    label: "Button",
    styles: {
      width: 100,
      height: 40,
      backgroundColor: "#6b46c1",  // purple-ish
      color: "#ffffff",
      fontSize: 16,
      borderRadius: 6,
      shadow: true,
      padding: 10,
      text: "Button",
    },
  },
  {
    type: "text",
    label: "Text",
    styles: {
      width: 100,
      height: 30,
      backgroundColor: "transparent",
      fontSize: 16,
      fontWeight: "normal",
      color: "#4c1d95", // dark purple
      textAlign: "left",
      text: "Sample Text",
    },
  },
  {
    type: "input",
    label: "Input",
    styles: {
      width: 100,
      height: 30,
      backgroundColor: "#ffffff",
      fontSize: 16,
      borderColor: "#d1d5db",  // gray border
      placeholder: "Enter text",
    },
  },
  {
    type: "container",
    label: "Container",
    styles: {
      width: 100,
      height: 200,
      backgroundColor: "#f7fafc",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch",
      gap: 8,
      padding: 10,
    },
    children: [],
  },
];
