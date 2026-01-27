/**
 * Email Service - JavaScript Mastery Implementation
 * 
 * Features:
 * - Professional email generation
 * - CSV attachment management
 * - Mailto protocol handling
 * - Cross-platform compatibility
 * - Error handling and fallbacks
 */

import { downloadEnhancedCSV } from '../utils/export';
import { useCoachStore } from '../store/coachStore';

class EmailSubmissionService {
    constructor() {
        this.attachmentService = new CSVAttachmentService();
        this.templateEngine = new EmailTemplateEngine();
    }

    /**
     * Generate complete email content for coach submission
     */
    async generateEmailContent(matchData, coachId = null, formatTime) {
        try {
            const coachStore = useCoachStore.getState();
            const emailData = coachStore.generateEmailContent(matchData, coachId, formatTime);
            
            // Add mailto URL
            emailData.mailtoUrl = this.formatEmailForMailto(emailData);
            
            return emailData;
        } catch (error) {
            console.error('Error generating email content:', error);
            throw new Error(`Failed to generate email content: ${error.message}`);
        }
    }

    /**
     * Open email client with pre-filled content
     */
    async openEmailClient(matchData, coachId = null, formatTime) {
        try {
            // Generate email content
            const emailData = await this.generateEmailContent(matchData, coachId, formatTime);
            
            // Create CSV attachment
            const attachment = await this.attachmentService.createAttachment(matchData);
            
            // Open email client
            const result = await this.openMailtoClient(emailData);
            
            // Show attachment instructions
            this.showAttachmentInstructions(attachment);
            
            return {
                success: true,
                emailData,
                attachment,
                clientOpened: true
            };
        } catch (error) {
            console.error('Error opening email client:', error);
            return {
                success: false,
                error: error.message,
                clientOpened: false
            };
        }
    }

    /**
     * Format email data for mailto protocol
     */
    formatEmailForMailto(emailData) {
        const { to, subject, body } = emailData;
        
        // Encode for URL
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        
        return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
    }

    /**
     * Open mailto client with error handling
     */
    async openMailtoClient(emailData) {
        return new Promise((resolve, reject) => {
            try {
                const mailtoUrl = emailData.mailtoUrl;
                
                // Check if mailto is supported
                if (!this.isMailtoSupported()) {
                    throw new Error('Email client not supported on this device');
                }
                
                // Open email client
                window.location.href = mailtoUrl;
                
                // Small delay to allow client to open
                setTimeout(() => {
                    resolve({
                        success: true,
                        url: mailtoUrl,
                        message: 'Email client opened successfully'
                    });
                }, 100);
                
            } catch (error) {
                reject(new Error(`Failed to open email client: ${error.message}`));
            }
        });
    }

    /**
     * Check if mailto protocol is supported
     */
    isMailtoSupported() {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            return false;
        }
        
        // Check for mobile devices
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Check for desktop email clients
        const hasMailto = 'mailto' in window.location;
        
        return isMobile || hasMailto;
    }

    /**
     * Show attachment instructions to user
     */
    showAttachmentInstructions(attachment) {
        // Create instruction modal or alert
        const instructions = this.generateAttachmentInstructions(attachment);
        
        // You could integrate this with a modal system
        console.log('Attachment Instructions:', instructions);
        
        // For now, return instructions for UI integration
        return instructions;
    }

    /**
     * Generate attachment instructions
     */
    generateAttachmentInstructions(attachment) {
        return {
            title: '📧 Email Opened!',
            message: 'Your email client has opened with the match report.',
            steps: [
                '1. Click "Attach File" in your email client',
                `2. Select the downloaded file: ${attachment.filename}`,
                '3. The file contains complete match statistics',
                '4. Send the email to your coach'
            ],
            filename: attachment.filename,
            downloadPath: 'Downloads folder'
        };
    }
}

/**
 * CSV Attachment Service
 */
class CSVAttachmentService {
    /**
     * Create CSV attachment for email
     */
    async createAttachment(matchData) {
        try {
            // Generate enhanced CSV content
            const csvContent = this.generateEnhancedCSV(matchData);
            const filename = this.generateFilename(matchData);
            
            // Create downloadable file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            // Trigger download
            this.downloadFile(url, filename);
            
            return {
                filename,
                content: csvContent,
                downloadUrl: url,
                size: blob.size,
                type: 'text/csv'
            };
        } catch (error) {
            console.error('Error creating CSV attachment:', error);
            throw new Error(`Failed to create CSV attachment: ${error.message}`);
        }
    }

    /**
     * Generate enhanced CSV content
     */
    generateEnhancedCSV(matchData) {
        const headers = [
            'Match ID',
            'Date',
            'Opponent',
            'Final Score',
            'Event Timestamp',
            'Game Time',
            'Event Type',
            'Team',
            'Player',
            'Is Penalty',
            'Notes'
        ];
        
        const matchInfo = [
            matchData.id || crypto.randomUUID(),
            new Date(matchData.timestamp || Date.now()).toLocaleString(),
            matchData.opponentName,
            `${matchData.myScore}-${matchData.opponentScore}`,
            '', '', '', '', '', '', ''
        ];
        
        const eventRows = matchData.events.map(event => [
            '', // Match ID (empty for events)
            '', // Date (empty for events)
            '', // Opponent (empty for events)
            '', // Final Score (empty for events)
            new Date(event.timestamp).toLocaleString(),
            event.gameTime,
            event.type,
            event.team,
            event.label || '',
            event.meta?.isPK ? 'Yes' : 'No',
            event.meta?.notes || ''
        ]);
        
        return [headers, matchInfo, ...eventRows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    /**
     * Generate filename for CSV
     */
    generateFilename(matchData) {
        const date = new Date().toISOString().split('T')[0];
        const opponent = matchData.opponentName.replace(/[^a-zA-Z0-9]/g, '_');
        return `match-report-${opponent}-${date}.csv`;
    }

    /**
     * Download file to user's device
     */
    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up URL
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
}

/**
 * Email Template Engine
 */
class EmailTemplateEngine {
    /**
     * Generate professional email subject
     */
    generateSubject(matchData) {
        const date = new Date(matchData.timestamp).toLocaleDateString();
        const result = this.getMatchResult(matchData);
        const opponent = matchData.opponentName;
        
        return `📊 Match Report: ${opponent} (${result}) - ${date}`;
    }

    /**
     * Get match result for subject
     */
    getMatchResult(matchData) {
        if (matchData.myScore > matchData.opponentScore) return 'WIN';
        if (matchData.myScore < matchData.opponentScore) return 'LOSS';
        return 'DRAW';
    }

    /**
     * Generate comprehensive email body
     */
    generateBody(matchData, coachInfo, formatTime) {
        const sections = [
            this.generateSalutation(coachInfo),
            this.generateMatchSummary(matchData, formatTime),
            this.generateDetailedStats(matchData),
            this.generateActionItems(matchData),
            this.generateClosing(),
            this.generateSignature()
        ];
        
        return sections.join('\n\n');
    }

    /**
     * Generate salutation
     */
    generateSalutation(coachInfo) {
        return `Dear ${coachInfo.name},`;
    }

    /**
     * Generate match summary
     */
    generateMatchSummary(matchData, formatTime) {
        return `📊 MATCH SUMMARY
═══════════════════════════
🏆 Match: Us vs ${matchData.opponentName}
⚡ Final Score: ${matchData.myScore}-${matchData.opponentScore}
📅 Date: ${new Date(matchData.timestamp).toLocaleDateString()}
⏱️ Duration: ${formatTime ? formatTime(matchData.finalTime) : matchData.finalTime || 'Unknown'}
📝 Events: ${matchData.events.length} total`;
    }

    /**
     * Generate detailed statistics
     */
    generateDetailedStats(matchData) {
        const stats = this.calculateStats(matchData);
        
        return `📈 DETAILED STATISTICS
═══════════════════════════
⚽ Goals Scored: ${stats.ourGoals}
🥅 Goals Conceded: ${stats.theirGoals}
🟨 Penalties: ${stats.ourPenalties}
🟥 Opponent Penalties: ${stats.theirPenalties}
📊 Goal Difference: ${stats.goalDifference > 0 ? '+' : ''}${stats.goalDifference}
🎯 Scoring Rate: ${stats.scoringRate} goals per event`;
    }

    /**
     * Calculate match statistics
     */
    calculateStats(matchData) {
        const ourGoals = matchData.events.filter(e => e.type === 'goal' && e.team === 'us').length;
        const theirGoals = matchData.events.filter(e => e.type === 'goal' && e.team === 'them').length;
        const ourPenalties = matchData.events.filter(e => e.type === 'penalty' && e.team === 'us').length;
        const theirPenalties = matchData.events.filter(e => e.type === 'penalty' && e.team === 'them').length;
        
        return {
            ourGoals,
            theirGoals,
            ourPenalties,
            theirPenalties,
            goalDifference: ourGoals - theirGoals,
            scoringRate: matchData.events.length > 0 ? (ourGoals / matchData.events.length).toFixed(2) : '0.00'
        };
    }

    /**
     * Generate action items for coach
     */
    generateActionItems(matchData) {
        const stats = this.calculateStats(matchData);
        const actions = [];
        
        if (stats.goalDifference > 0) {
            actions.push('✅ Strong offensive performance - maintain momentum');
        } else if (stats.goalDifference < 0) {
            actions.push('🎯 Focus on defensive organization in next training');
        }
        
        if (stats.ourPenalties > stats.theirPenalties) {
            actions.push('⚠️ Review discipline - reduce penalty count');
        }
        
        if (stats.ourGoals === 0) {
            actions.push('🔥 Work on finishing and scoring opportunities');
        }
        
        if (actions.length === 0) {
            actions.push('👍 Solid performance - continue current strategy');
        }
        
        return `🎯 COACHING NOTES
═══════════════════════════
${actions.join('\n')}`;
    }

    /**
     * Generate closing
     */
    generateClosing() {
        return `The complete CSV data is attached for your detailed analysis.

Best regards,
Sideline Stats Tracker
${new Date().toLocaleDateString()}`;
    }

    /**
     * Generate signature
     */
    generateSignature() {
        return `---
Generated by Sideline Stats App
Professional Sports Metrics Tracking`;
    }
}

// Export main service
export const EmailService = new EmailSubmissionService();

// Export utility classes for testing
export { CSVAttachmentService, EmailTemplateEngine };
