// Advanced export utilities for multiple formats

const CSV_HEADERS = ['Timestamp', 'Game Time', 'Type', 'Team', 'Label', 'Is PK', 'Player'];
const JSON_HEADERS = ['timestamp', 'gameTime', 'type', 'team', 'label', 'meta'];

export const EXPORT_FORMATS = {
    CSV: 'csv',
    JSON: 'json',
    PDF: 'pdf'
};

const formatEventRow = (event) => [
    new Date(event.timestamp).toLocaleString(),
    event.gameTime,
    event.type,
    event.team,
    event.label || 'Unnamed',
    event.meta?.isPK ? 'Yes' : 'No',
    event.meta?.player || ''
];

const generateCSVContent = (events) => {
    const rows = events.map(formatEventRow);
    return [CSV_HEADERS.join(','), ...rows.map(row => row.join(','))].join('\n');
};

const generateJSONContent = (game) => {
    return JSON.stringify({
        gameInfo: {
            opponentName: game.opponentName,
            finalScore: `${game.myScore} - ${game.opponentScore}`,
            finalTime: game.finalTime,
            timestamp: game.timestamp
        },
        events: game.events,
        exportDate: new Date().toISOString()
    }, null, 2);
};

const generatePDFContent = async (game) => {
    // Simple PDF generation using browser print
    const htmlContent = `
        <html>
            <head>
                <title>Match Report - ${game.opponentName}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #1e40af; }
                    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Match Report: ${game.opponentName}</h1>
                <p><strong>Final Score:</strong> ${game.myScore} - ${game.opponentScore}</p>
                <p><strong>Game Time:</strong> ${Math.floor(game.finalTime / 60000)}:${Math.floor((game.finalTime % 60000) / 1000).toString().padStart(2, '0')}</p>
                <p><strong>Date:</strong> ${new Date(game.timestamp).toLocaleDateString()}</p>
                
                <h2>Events</h2>
                <table>
                    <tr>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Team</th>
                        <th>Player</th>
                        <th>Details</th>
                    </tr>
                    ${game.events.map(event => `
                        <tr>
                            <td>${Math.floor(event.gameTime / 60000)}:${Math.floor((event.gameTime % 60000) / 1000).toString().padStart(2, '0')}</td>
                            <td>${event.type}</td>
                            <td>${event.team}</td>
                            <td>${event.meta?.player || event.label || ''}</td>
                            <td>${event.meta?.isPK ? 'Penalty Kick' : ''}</td>
                        </tr>
                    `).join('')}
                </table>
            </body>
        </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return URL.createObjectURL(blob);
};

const downloadFile = (content, filename, mimeType = 'text/csv') => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
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

const generateFilename = (opponentName, format) => {
    const date = new Date().toISOString().split('T')[0];
    const cleanName = opponentName.replace(/[^a-zA-Z0-9]/g, '-');
    return `match-${cleanName}-${date}.${format}`;
};

export const downloadAdvancedExport = async (game, format = EXPORT_FORMATS.CSV) => {
    let content;
    let filename;
    let mimeType;
    
    switch (format) {
        case EXPORT_FORMATS.JSON:
            content = generateJSONContent(game);
            filename = generateFilename(game.opponentName, 'json');
            mimeType = 'application/json';
            break;
            
        case EXPORT_FORMATS.PDF:
            content = await generatePDFContent(game);
            filename = generateFilename(game.opponentName, 'html');
            mimeType = 'text/html';
            break;
            
        case EXPORT_FORMATS.CSV:
        default:
            content = generateCSVContent(game.events);
            filename = generateFilename(game.opponentName, 'csv');
            mimeType = 'text/csv';
            break;
    }
    
    downloadFile(content, filename, mimeType);
};

// Season aggregation
export const generateSeasonReport = (games) => {
    const seasonStats = {
        totalGames: games.length,
        totalGoals: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        playerStats: {},
        averageGameTime: 0
    };
    
    games.forEach(game => {
        seasonStats.totalGoals += game.myScore + game.opponentScore;
        
        if (game.myScore > game.opponentScore) seasonStats.wins++;
        else if (game.myScore < game.opponentScore) seasonStats.losses++;
        else seasonStats.draws++;
        
        seasonStats.averageGameTime += game.finalTime;
        
        // Aggregate player statistics
        game.events.forEach(event => {
            if (event.meta?.player) {
                if (!seasonStats.playerStats[event.meta.player]) {
                    seasonStats.playerStats[event.meta.player] = {
                        goals: 0,
                        penalties: 0,
                        cards: 0
                    };
                }
                
                if (event.type === 'goal') {
                    seasonStats.playerStats[event.meta.player].goals++;
                    if (event.meta?.isPK) {
                        seasonStats.playerStats[event.meta.player].penalties++;
                    }
                }
                
                if (event.type.includes('card')) {
                    seasonStats.playerStats[event.meta.player].cards++;
                }
            }
        });
    });
    
    seasonStats.averageGameTime = Math.floor(seasonStats.averageGameTime / games.length);
    
    return seasonStats;
};
