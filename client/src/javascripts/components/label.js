export default function createLabel(title, color, data) {
    const labelTitle = title || "";
    const labelColor = color || "#000";
    const label = document.createElement("span");
    label.className = "label active";
    label.setAttribute("title", labelTitle);
    label.style.background = labelColor;
    label.dataset.color = data;
    return label;
}
