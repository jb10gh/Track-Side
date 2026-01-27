const CSV_HEADERS = ['Timestamp', 'Game Time', 'Type', 'Team', 'Label', 'Is PK'];

const formatEventRow = (event) => [
    new Date(event.timestamp).toLocaleString(),
    event.gameTime,
    event.type,
    event.team,
    event.label || 'Unnamed',
    event.meta?.isPK ? 'Yes' : 'No'
];

const generateCSVContent = (events) => {
    const rows = events.map(formatEventRow);
    return [CSV_HEADERS.join(','), ...rows.map(row => row.join(','))].join('\n');
};

const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
};

const generateFilename = (opponentName) => {
    const date = new Date().toISOString().split('T')[0];
    return `match-${opponentName}-${date}.csv`;
};

export const downloadCSV = (game) => {
    const csvContent = generateCSVContent(game.events);
    const filename = generateFilename(game.opponentName);
    downloadFile(csvContent, filename);
};
