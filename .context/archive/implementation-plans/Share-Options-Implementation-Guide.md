---
@skills: ui-ux-pro-max, javascript-mastery, content-creator, typescript-expert
context_priority: high
document_type: implementation-guide
technical_depth: expert
audience: [developers, ui-designers, product-managers]
last_updated: 2024-01-27
reviewers: [human, ai-assistant]
---

# 📱 Share Options Implementation Guide

## 🤖 AI Assistant Instructions
**Primary Skills:**
- @skills:ui-ux-pro-max for user experience and interface design
- @skills:javascript-mastery for sharing functionality and platform integration
- @skills:content-creator for content optimization and formatting
- @skills:typescript-expert for type safety and implementation precision

## 📋 **Overview**
Implement comprehensive share options for individual game editing screens, enabling users to resubmit match data through multiple channels with optimized content for different platforms and audiences.

## 🎯 **Core Objectives**

### **1. Multi-Platform Sharing** (@skills:ui-ux-pro-max)
- **Email Sharing**: Enhanced email with multiple recipients
- **Social Media**: Optimized content for platforms
- **Messaging Apps**: Quick share to messaging platforms
- **File Export**: Multiple format options
- **Link Sharing**: Shareable match links
- **Print Options**: Printable match reports

### **2. Content Optimization** (@skills:content-creator)
- **Platform-Specific**: Tailored content for each platform
- **Audience-Specific**: Different formats for coaches vs. team members
- **Visual Appeal**: Engaging graphics and formatting
- **Data Privacy**: Appropriate data sharing levels

### **3. User Experience** (@skills:ui-ux-pro-max)
- **One-Click Sharing**: Quick and easy sharing
- **Intuitive Interface**: Clear share options
- **Mobile Optimization**: Touch-friendly sharing
- **Feedback System**: Share success/failure notifications

## 🏗️ **Architecture Design**

### **Share Service Architecture** (@skills:typescript-expert)
```typescript
// Core share service interface
interface ShareService {
  shareEmail(matchData: MatchData, config: EmailShareConfig): Promise<void>;
  shareSocial(matchData: MatchData, platform: SocialPlatform): Promise<void>;
  shareMessaging(matchData: MatchData, app: MessagingApp): Promise<void>;
  exportFile(matchData: MatchData, format: ExportFormat): Promise<File>;
  generateShareLink(matchData: MatchData): Promise<string>;
  printReport(matchData: MatchData): Promise<void>;
}

// Share configuration types
interface EmailShareConfig {
  recipients: string[];
  subject: string;
  body: string;
  includeCSV: boolean;
  includeImages: boolean;
  template: 'professional' | 'casual' | 'detailed';
}

interface SocialShareConfig {
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin';
  message: string;
  hashtags: string[];
  includeImage: boolean;
  privacy: 'public' | 'friends' | 'private';
}

interface MessagingShareConfig {
  app: 'whatsapp' | 'telegram' | 'slack' | 'teams';
  message: string;
  includeFile: boolean;
  format: 'text' | 'rich' | 'card';
}
```

### **Content Generation System** (@skills:content-creator)
```typescript
class ShareContentGenerator {
  generateEmailContent(matchData: MatchData, config: EmailShareConfig): EmailContent {
    const template = this.getEmailTemplate(config.template);
    const summary = this.generateMatchSummary(matchData);
    const statistics = this.generateStatistics(matchData);
    
    return {
      subject: this.generateSubject(matchData, config),
      body: template.render({ matchData, summary, statistics }),
      attachments: config.includeCSV ? [this.generateCSV(matchData)] : []
    };
  }

  generateSocialContent(matchData: MatchData, platform: SocialPlatform): SocialContent {
    const templates = {
      twitter: this.generateTwitterContent,
      facebook: this.generateFacebookContent,
      instagram: this.generateInstagramContent,
      linkedin: this.generateLinkedInContent
    };
    
    return templates[platform](matchData);
  }

  generateMessagingContent(matchData: MatchData, app: MessagingApp): MessagingContent {
    const content = this.formatMatchForMessaging(matchData, app);
    return {
      text: content.text,
      media: content.media,
      metadata: content.metadata
    };
  }

  private generateSubject(matchData: MatchData, config: EmailShareConfig): string {
    const date = new Date(matchData.timestamp).toLocaleDateString();
    const score = `${matchData.myScore}-${matchData.opponentScore}`;
    
    switch (config.template) {
      case 'professional':
        return `Match Report: ${matchData.opponentName} (${score}) - ${date}`;
      case 'casual':
        return `Great game vs ${matchData.opponentName}! Final: ${score}`;
      case 'detailed':
        return `Detailed Match Analysis: ${matchData.opponentName} - ${date} - Score: ${score} - Events: ${matchData.events.length}`;
      default:
        return `Match Report: ${matchData.opponentName}`;
    }
  }

  private generateMatchSummary(matchData: MatchData): string {
    const events = matchData.events.map(event => 
      `[${event.gameTime}] ${event.type} (${event.team}): ${event.label}`
    ).join('\n');

    return `
Match Summary
=============
Opponent: ${matchData.opponentName}
Date: ${new Date(matchData.timestamp).toLocaleDateString()}
Final Score: ${matchData.myScore} - ${matchData.opponentScore}
Duration: ${matchData.finalTime}

Key Events:
${events}

Performance Highlights:
- Our Goals: ${matchData.events.filter(e => e.type === 'goal' && e.team === 'us').length}
- Their Goals: ${matchData.events.filter(e => e.type === 'goal' && e.team === 'them').length}
- Total Events: ${matchData.events.length}
- Possession Time: ${this.calculatePossession(matchData)}
    `.trim();
  }
}
```

## 🎨 **UI/UX Implementation** (@skills:ui-ux-pro-max)

### **Share Panel Component**
```typescript
export const SharePanel = ({ matchData, onClose }: SharePanelProps) => {
  const [selectedTab, setSelectedTab] = useState<ShareTab>('email');
  const [shareConfig, setShareConfig] = useState<ShareConfig>({});
  const [isSharing, setIsSharing] = useState(false);
  const [shareResult, setShareResult] = useState<ShareResult | null>(null);

  const shareTabs: ShareTabConfig[] = [
    { id: 'email', label: 'Email', icon: Mail, description: 'Send to coaches' },
    { id: 'social', label: 'Social', icon: Share2, description: 'Share on social media' },
    { id: 'messaging', label: 'Messaging', icon: MessageCircle, description: 'Send to team' },
    { id: 'export', label: 'Export', icon: Download, description: 'Download files' },
    { id: 'link', label: 'Link', icon: Link, description: 'Shareable link' },
    { id: 'print', label: 'Print', icon: Printer, description: 'Print report' }
  ];

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareService = new ShareService();
      const result = await shareService.share(matchData, selectedTab, shareConfig);
      setShareResult({ success: true, message: 'Shared successfully!' });
    } catch (error) {
      setShareResult({ success: false, message: 'Share failed. Please try again.' });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Share Match">
      <div className="share-panel">
        {/* Tab Navigation */}
        <div className="share-tabs">
          {shareTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`share-tab ${selectedTab === tab.id ? 'active' : ''}`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
              <small>{tab.description}</small>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="share-content">
          {selectedTab === 'email' && (
            <EmailShareTab 
              matchData={matchData}
              config={shareConfig}
              onConfigChange={setShareConfig}
            />
          )}
          {selectedTab === 'social' && (
            <SocialShareTab 
              matchData={matchData}
              config={shareConfig}
              onConfigChange={setShareConfig}
            />
          )}
          {selectedTab === 'messaging' && (
            <MessagingShareTab 
              matchData={matchData}
              config={shareConfig}
              onConfigChange={setShareConfig}
            />
          )}
          {selectedTab === 'export' && (
            <ExportShareTab 
              matchData={matchData}
              config={shareConfig}
              onConfigChange={setShareConfig}
            />
          )}
          {selectedTab === 'link' && (
            <LinkShareTab 
              matchData={matchData}
              config={shareConfig}
              onConfigChange={setShareConfig}
            />
          )}
          {selectedTab === 'print' && (
            <PrintShareTab 
              matchData={matchData}
              config={shareConfig}
              onConfigChange={setShareConfig}
            />
          )}
        </div>

        {/* Share Actions */}
        <div className="share-actions">
          <Button 
            onClick={handleShare}
            disabled={isSharing}
            loading={isSharing}
            variant="primary"
            size="lg"
          >
            {isSharing ? 'Sharing...' : 'Share'}
          </Button>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>

        {/* Share Result */}
        {shareResult && (
          <div className={`share-result ${shareResult.success ? 'success' : 'error'}`}>
            {shareResult.message}
          </div>
        )}
      </div>
    </Modal>
  );
};
```

### **Email Share Tab Component**
```typescript
export const EmailShareTab = ({ matchData, config, onConfigChange }: EmailShareTabProps) => {
  const [recipients, setRecipients] = useState<string[]>(config.recipients || []);
  const [template, setTemplate] = useState<EmailTemplate>('professional');
  const [includeCSV, setIncludeCSV] = useState(true);
  const [includeImages, setIncludeImages] = useState(false);

  const contentGenerator = new ShareContentGenerator();
  const [preview, setPreview] = useState<EmailContent | null>(null);

  useEffect(() => {
    const emailConfig: EmailShareConfig = {
      recipients,
      template,
      includeCSV,
      includeImages
    };
    
    const emailContent = contentGenerator.generateEmailContent(matchData, emailConfig);
    setPreview(emailContent);
    
    onConfigChange({ ...config, ...emailConfig });
  }, [recipients, template, includeCSV, includeImages]);

  const addRecipient = (email: string) => {
    setRecipients([...recipients, email]);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  return (
    <div className="email-share-tab">
      <div className="email-recipients">
        <h4>Recipients</h4>
        <RecipientInput onAdd={addRecipient} />
        <RecipientList recipients={recipients} onRemove={removeRecipient} />
      </div>

      <div className="email-options">
        <h4>Email Options</h4>
        <div className="option-group">
          <label>Template</label>
          <select value={template} onChange={(e) => setTemplate(e.target.value as EmailTemplate)}>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>
        
        <div className="option-group">
          <label>
            <input
              type="checkbox"
              checked={includeCSV}
              onChange={(e) => setIncludeCSV(e.target.checked)}
            />
            Include CSV attachment
          </label>
        </div>
        
        <div className="option-group">
          <label>
            <input
              type="checkbox"
              checked={includeImages}
              onChange={(e) => setIncludeImages(e.target.checked)}
            />
            Include images/charts
          </label>
        </div>
      </div>

      {preview && (
        <div className="email-preview">
          <h4>Preview</h4>
          <div className="preview-subject">
            <strong>Subject:</strong> {preview.subject}
          </div>
          <div className="preview-body">
            <pre>{preview.body}</pre>
          </div>
          {preview.attachments.length > 0 && (
            <div className="preview-attachments">
              <strong>Attachments:</strong>
              {preview.attachments.map(file => (
                <span key={file.name} className="attachment">
                  📎 {file.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

### **Social Share Tab Component**
```typescript
export const SocialShareTab = ({ matchData, config, onConfigChange }: SocialShareTabProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('twitter');
  const [customMessage, setCustomMessage] = useState('');
  const [includeImage, setIncludeImage] = useState(true);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');

  const contentGenerator = new ShareContentGenerator();
  const [preview, setPreview] = useState<SocialContent | null>(null);

  const platforms: SocialPlatformConfig[] = [
    { id: 'twitter', name: 'Twitter', icon: Twitter, maxLength: 280, hashtags: true },
    { id: 'facebook', name: 'Facebook', icon: Facebook, maxLength: 500, hashtags: false },
    { id: 'instagram', name: 'Instagram', icon: Instagram, maxLength: 2200, hashtags: true },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, maxLength: 700, hashtags: false }
  ];

  useEffect(() => {
    const socialConfig: SocialShareConfig = {
      platform: selectedPlatform,
      message: customMessage,
      hashtags: this.generateHashtags(matchData),
      includeImage,
      privacy
    };
    
    const socialContent = contentGenerator.generateSocialContent(matchData, selectedPlatform);
    setPreview(socialContent);
    
    onConfigChange({ ...config, ...socialConfig });
  }, [selectedPlatform, customMessage, includeImage, privacy]);

  const handleShare = async () => {
    const shareUrl = this.generateSocialShareUrl(selectedPlatform, preview);
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="social-share-tab">
      <div className="platform-selector">
        <h4>Choose Platform</h4>
        <div className="platform-grid">
          {platforms.map(platform => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`platform-button ${selectedPlatform === platform.id ? 'active' : ''}`}
            >
              <platform.icon size={24} />
              <span>{platform.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="social-options">
        <h4>Message Options</h4>
        <div className="option-group">
          <label>Custom Message</label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Add your personal message..."
            maxLength={platforms.find(p => p.id === selectedPlatform)?.maxLength}
          />
          <small>{customMessage.length} / {platforms.find(p => p.id === selectedPlatform)?.maxLength}</small>
        </div>
        
        <div className="option-group">
          <label>
            <input
              type="checkbox"
              checked={includeImage}
              onChange={(e) => setIncludeImage(e.target.checked)}
            />
            Include match summary image
          </label>
        </div>
        
        <div className="option-group">
          <label>Privacy</label>
          <select value={privacy} onChange={(e) => setPrivacy(e.target.value as any)}>
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {preview && (
        <div className="social-preview">
          <h4>Preview</h4>
          <div className="preview-content">
            <div className="preview-text">{preview.message}</div>
            {preview.hashtags && (
              <div className="preview-hashtags">
                {preview.hashtags.map(tag => `#${tag}`).join(' ')}
              </div>
            )}
            {includeImage && (
              <div className="preview-image">
                <MatchSummaryImage matchData={matchData} />
              </div>
            )}
          </div>
          <Button onClick={handleShare} variant="primary">
            Share to {platforms.find(p => p.id === selectedPlatform)?.name}
          </Button>
        </div>
      )}
    </div>
  );
};
```

## 📱 **Mobile-Optimized Interface** (@skills:ui-ux-pro-max)

### **Responsive CSS**
```css
/* Share panel mobile optimization */
.share-panel {
  max-width: 95vw;
  max-height: 90vh;
  padding: 1rem;
}

.share-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.share-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-tab:hover {
  border-color: var(--team-our-primary);
  transform: translateY(-2px);
}

.share-tab.active {
  border-color: var(--team-our-primary);
  background: var(--team-our-bg);
}

.share-tab svg {
  margin-bottom: 0.25rem;
}

.share-tab span {
  font-weight: 600;
  font-size: 0.875rem;
}

.share-tab small {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

/* Email tab mobile optimization */
.email-share-tab {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.email-recipients {
  order: 1;
}

.email-options {
  order: 2;
}

.email-preview {
  order: 3;
  max-height: 200px;
  overflow-y: auto;
}

/* Social tab mobile optimization */
.social-share-tab {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.platform-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.platform-button:hover {
  border-color: var(--team-our-primary);
  transform: translateY(-2px);
}

.platform-button.active {
  border-color: var(--team-our-primary);
  background: var(--team-our-bg);
}

/* Touch-friendly buttons */
.share-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.share-actions button {
  flex: 1;
  min-height: 48px;
  font-size: 1rem;
  font-weight: 600;
}

/* Responsive design */
@media (min-width: 768px) {
  .share-panel {
    max-width: 600px;
  }
  
  .share-tabs {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .platform-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .email-share-tab {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .email-preview {
    grid-column: 1 / -1;
  }
}
```

## 🔄 **Share Service Implementation** (@skills:javascript-mastery)

### **Core Share Service**
```typescript
export class ShareService {
  private contentGenerator = new ShareContentGenerator();
  private platformIntegrations = new Map<SocialPlatform, PlatformIntegration>();

  constructor() {
    this.initializePlatformIntegrations();
  }

  async shareEmail(matchData: MatchData, config: EmailShareConfig): Promise<void> {
    const emailContent = this.contentGenerator.generateEmailContent(matchData, config);
    
    // Create mailto URL
    const params = new URLSearchParams({
      to: config.recipients.join(','),
      subject: emailContent.subject,
      body: emailContent.body
    });
    
    const mailtoUrl = `mailto:${config.recipients.join(',')}?${params.toString()}`;
    window.location.href = mailtoUrl;
  }

  async shareSocial(matchData: MatchData, platform: SocialPlatform, config: SocialShareConfig): Promise<void> {
    const socialContent = this.contentGenerator.generateSocialContent(matchData, platform);
    const integration = this.platformIntegrations.get(platform);
    
    if (!integration) {
      throw new Error(`Platform integration not available: ${platform}`);
    }
    
    await integration.share(socialContent, config);
  }

  async shareMessaging(matchData: MatchData, app: MessagingApp, config: MessagingShareConfig): Promise<void> {
    const messagingContent = this.contentGenerator.generateMessagingContent(matchData, app);
    
    switch (app) {
      case 'whatsapp':
        await this.shareToWhatsApp(messagingContent);
        break;
      case 'telegram':
        await this.shareToTelegram(messagingContent);
        break;
      case 'slack':
        await this.shareToSlack(messagingContent);
        break;
      case 'teams':
        await this.shareToTeams(messagingContent);
        break;
      default:
        throw new Error(`Messaging app not supported: ${app}`);
    }
  }

  async exportFile(matchData: MatchData, format: ExportFormat): Promise<File> {
    switch (format) {
      case 'csv':
        return this.generateCSV(matchData);
      case 'json':
        return this.generateJSON(matchData);
      case 'pdf':
        return this.generatePDF(matchData);
      case 'xlsx':
        return this.generateExcel(matchData);
      default:
        throw new Error(`Export format not supported: ${format}`);
    }
  }

  async generateShareLink(matchData: MatchData): Promise<string> {
    // Generate unique shareable link
    const shareId = this.generateShareId();
    await this.storeShareableMatch(shareId, matchData);
    
    return `${window.location.origin}/shared/${shareId}`;
  }

  async printReport(matchData: MatchData): Promise<void> {
    const printContent = this.contentGenerator.generatePrintContent(matchData);
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  private async shareToWhatsApp(content: MessagingContent): Promise<void> {
    const text = encodeURIComponent(content.text);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
  }

  private async shareToTelegram(content: MessagingContent): Promise<void> {
    const text = encodeURIComponent(content.text);
    const telegramUrl = `https://t.me/share/url?text=${text}`;
    window.open(telegramUrl, '_blank');
  }

  private async shareToSlack(content: MessagingContent): Promise<void> {
    // Slack integration would require OAuth and API access
    // For now, redirect to Slack with pre-filled message
    const text = encodeURIComponent(content.text);
    const slackUrl = `https://slack.com/app_redirect?channel=&message=${text}`;
    window.open(slackUrl, '_blank');
  }

  private async shareToTeams(content: MessagingContent): Promise<void> {
    // Teams integration would require OAuth and API access
    // For now, redirect to Teams with pre-filled message
    const text = encodeURIComponent(content.text);
    const teamsUrl = `https://teams.microsoft.com/share?href=${text}`;
    window.open(teamsUrl, '_blank');
  }

  private initializePlatformIntegrations(): void {
    this.platformIntegrations.set('twitter', new TwitterIntegration());
    this.platformIntegrations.set('facebook', new FacebookIntegration());
    this.platformIntegrations.set('instagram', new InstagramIntegration());
    this.platformIntegrations.set('linkedin', new LinkedInIntegration());
  }
}
```

### **Platform Integration Classes**
```typescript
class TwitterIntegration implements PlatformIntegration {
  async share(content: SocialContent, config: SocialShareConfig): Promise<void> {
    const text = encodeURIComponent(content.message);
    const hashtags = config.hashtags ? content.hashtags.map(tag => `%23${tag}`).join('%20') : '';
    const url = `https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtags}`;
    window.open(url, '_blank');
  }
}

class FacebookIntegration implements PlatformIntegration {
  async share(content: SocialContent, config: SocialShareConfig): Promise<void> {
    const url = encodeURIComponent(window.location.href);
    const quote = encodeURIComponent(content.message);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`;
    window.open(facebookUrl, '_blank');
  }
}

class LinkedInIntegration implements PlatformIntegration {
  async share(content: SocialContent, config: SocialShareConfig): Promise<void> {
    const url = encodeURIComponent(window.location.href);
    const summary = encodeURIComponent(content.message);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${summary}`;
    window.open(linkedinUrl, '_blank');
  }
}
```

## 🧪 **Testing Strategy** (@skills:typescript-expert)

### **Share Service Tests**
```typescript
describe('ShareService', () => {
  let shareService: ShareService;
  let mockMatchData: MatchData;

  beforeEach(() => {
    shareService = new ShareService();
    mockMatchData = createMockMatchData();
  });

  describe('Email Sharing', () => {
    test('should generate correct mailto URL', async () => {
      const config: EmailShareConfig = {
        recipients: ['coach@example.com'],
        subject: 'Test Match',
        body: 'Match summary',
        includeCSV: false,
        includeImages: false,
        template: 'professional'
      };

      // Mock window.location.href
      const mockLocation = { href: '' };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true
      });

      await shareService.shareEmail(mockMatchData, config);

      expect(mockLocation.href).toContain('mailto:');
      expect(mockLocation.href).toContain('coach@example.com');
      expect(mockLocation.href).toContain('subject=Test%20Match');
    });
  });

  describe('Social Sharing', () => {
    test('should share to Twitter correctly', async () => {
      const config: SocialShareConfig = {
        platform: 'twitter',
        message: 'Great game!',
        hashtags: ['soccer', 'match'],
        includeImage: false,
        privacy: 'public'
      };

      const mockOpen = jest.fn();
      window.open = mockOpen;

      await shareService.shareSocial(mockMatchData, 'twitter', config);

      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('twitter.com/intent/tweet'),
        '_blank'
      );
    });
  });

  describe('File Export', () => {
    test('should generate CSV file', async () => {
      const file = await shareService.exportFile(mockMatchData, 'csv');

      expect(file).toBeInstanceOf(File);
      expect(file.type).toBe('text/csv');
      expect(file.name).toMatch(/\.csv$/);
    });

    test('should generate JSON file', async () => {
      const file = await shareService.exportFile(mockMatchData, 'json');

      expect(file).toBeInstanceOf(File);
      expect(file.type).toBe('application/json');
      expect(file.name).toMatch(/\.json$/);
    });
  });
});
```

### **Component Tests**
```typescript
describe('SharePanel', () => {
  test('should render all share tabs', () => {
    const mockMatchData = createMockMatchData();
    render(<SharePanel matchData={mockMatchData} onClose={jest.fn()} />);

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Social')).toBeInTheDocument();
    expect(screen.getByText('Messaging')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Link')).toBeInTheDocument();
    expect(screen.getByText('Print')).toBeInTheDocument();
  });

  test('should switch tabs correctly', async () => {
    const mockMatchData = createMockMatchData();
    render(<SharePanel matchData={mockMatchData} onClose={jest.fn()} />);

    const socialTab = screen.getByText('Social');
    await userEvent.click(socialTab);

    expect(screen.getByText('Choose Platform')).toBeInTheDocument();
  });

  test('should handle email sharing', async () => {
    const mockMatchData = createMockMatchData();
    const mockOnClose = jest.fn();
    
    render(<SharePanel matchData={mockMatchData} onClose={mockOnClose} />);

    // Add recipient
    const recipientInput = screen.getByPlaceholderText('Enter email address');
    await userEvent.type(recipientInput, 'coach@example.com');
    await userEvent.keyboard('{Enter}');

    // Click share
    const shareButton = screen.getByText('Share');
    await userEvent.click(shareButton);

    // Verify share was attempted
    expect(screen.getByText('Sharing...')).toBeInTheDocument();
  });
});
```

## 📊 **Performance Optimization** (@skills:typescript-expert)

### **Content Generation Optimization**
```typescript
class OptimizedContentGenerator extends ShareContentGenerator {
  private contentCache = new Map<string, any>();
  private templateCache = new Map<string, Function>();

  generateEmailContent(matchData: MatchData, config: EmailShareConfig): EmailContent {
    const cacheKey = this.generateCacheKey(matchData, config);
    
    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey);
    }

    const content = super.generateEmailContent(matchData, config);
    this.contentCache.set(cacheKey, content);
    
    return content;
  }

  private generateCacheKey(matchData: MatchData, config: any): string {
    return `${matchData.id}-${JSON.stringify(config)}`;
  }

  // Memoized template compilation
  private compileTemplate(template: string): Function {
    if (this.templateCache.has(template)) {
      return this.templateCache.get(template);
    }

    const compiled = this.compileTemplateString(template);
    this.templateCache.set(template, compiled);
    
    return compiled;
  }
}
```

## 📈 **Success Metrics**

### **User Engagement Metrics**
- **90%** of users utilize share options for historical matches
- **80%** reduction in time to resubmit match data
- **95%** user satisfaction with share options
- **75%** increase in coach communication frequency

### **Technical Performance Metrics**
- **<1s** share content generation time
- **<500ms** UI response time
- **100%** share platform compatibility
- **95%** test coverage for share functionality

### **Business Impact Metrics**
- **60%** increase in data sharing
- **40%** improvement in coach engagement
- **50%** reduction in support requests for sharing
- **85%** user retention improvement

---

*Implementation guide maintained with @skills:ui-ux-pro-max, @skills:javascript-mastery, @skills:content-creator, and @skills:typescript-expert*
