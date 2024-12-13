// World Clock Widget
// This script creates a widget displaying four analog clocks and corresponding digital clocks for different cities.
// The widget supports URL parameters for color scheme and font size of the digital clocks.

const urlParams = new URLSearchParams(window.location.search);

const bgColor = urlParams.get('bgColor') || '#000';
const fontColor = urlParams.get('fontColor') || '#FFD700';
const fontSize = parseInt(urlParams.get('fontSize'), 10) || 24; // Default font size of 24px

const cities = [
    { name: "Tokyo", offset: 9 },
    { name: "San Francisco", offset: -8 },
    { name: "Amsterdam", offset: 1 },
    { name: "Bali", offset: 8 },
];

const container = document.createElement('div');
container.style.display = 'grid';
container.style.gridTemplateColumns = '1fr 1fr';
container.style.gap = '20px';
container.style.backgroundColor = bgColor;
container.style.padding = '20px';
container.style.color = fontColor;
container.style.fontFamily = 'monospace';

cities.forEach(city => {
    const clockContainer = document.createElement('div');
    clockContainer.style.display = 'flex';
    clockContainer.style.flexDirection = 'column';
    clockContainer.style.alignItems = 'center';

    const analogClock = document.createElement('canvas');
    analogClock.width = 150;
    analogClock.height = 150;
    analogClock.style.border = `2px solid ${fontColor}`;
    analogClock.style.borderRadius = '50%';
    analogClock.style.backgroundColor = bgColor; // Match background color
    clockContainer.appendChild(analogClock);

    const digitalClock = document.createElement('div');
    digitalClock.style.fontSize = `${fontSize}px`;
    digitalClock.style.marginTop = '10px';
    digitalClock.style.fontFamily = 'Seven Segment, monospace';
    digitalClock.style.color = fontColor;
    clockContainer.appendChild(digitalClock);

    const cityLabel = document.createElement('div');
    cityLabel.textContent = city.name;
    cityLabel.style.marginTop = '5px';
    cityLabel.style.fontSize = `${fontSize * 0.5}px`;
    cityLabel.style.color = fontColor;
    clockContainer.appendChild(cityLabel);

    container.appendChild(clockContainer);

    function updateClock() {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const localTime = new Date(utc + city.offset * 3600000);

        // Analog clock - Swiss Train Station style
        const ctx = analogClock.getContext('2d');
        const radius = analogClock.width / 2;
        ctx.clearRect(0, 0, analogClock.width, analogClock.height);
        ctx.translate(radius, radius);

        // Clock face
        ctx.beginPath();
        ctx.arc(0, 0, radius - 10, 0, Math.PI * 2);
        ctx.fillStyle = bgColor; // Match background color
        ctx.fill();
        ctx.strokeStyle = fontColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw clock numbers
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${radius * 0.15}px Arial`;
        for (let num = 1; num <= 12; num++) {
            const angle = (num * Math.PI) / 6;
            const x = Math.cos(angle - Math.PI / 2) * (radius - 25);
            const y = Math.sin(angle - Math.PI / 2) * (radius - 25);
            ctx.fillText(num, x, y);
        }

        // Clock hands
        const drawHand = (position, length, width) => {
            const angle = position * (Math.PI / 30) - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(length * Math.cos(angle), length * Math.sin(angle));
            ctx.lineWidth = width;
            ctx.strokeStyle = fontColor;
            ctx.stroke();
        };

        const sec = localTime.getSeconds();
        const min = localTime.getMinutes();
        const hr = localTime.getHours() % 12;

        drawHand(sec, radius * 0.9, 1); // Second hand
        drawHand(min * 6 + sec * 0.1, radius * 0.7, 3); // Minute hand
        drawHand(hr * 30 + min * 0.5, radius * 0.5, 5); // Hour hand

        ctx.resetTransform();

        // Digital clock
        const hours = String(localTime.getHours()).padStart(2, '0');
        const minutes = String(localTime.getMinutes()).padStart(2, '0');
        const seconds = String(localTime.getSeconds()).padStart(2, '0');
        digitalClock.textContent = `${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateClock, 1000);
    updateClock();
});

document.body.appendChild(container);
