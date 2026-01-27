import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Share2, 
  MessageCircle, 
  Download, 
  Link, 
  Printer,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  X,
  FileText,
  Image
} from 'lucide-react';
import { Modal } from './Modal';

export const SharePanel = ({ matchData, onClose }) => {
  const [selectedTab, setSelectedTab] = useState('email');
  const [shareConfig, setShareConfig] = useState({});
  const [isSharing, setIsSharing] = useState(false);
  const [shareResult, setShareResult] = useState(null);
  const [preview, setPreview] = useState(null);

  const shareTabs = [
    { id: 'email', label: 'Email', icon: Mail, description: 'Send to coaches' },
    { id: 'social', label: 'Social', icon: Share2, description: 'Share on social media' },
    { id: 'messaging', label: 'Messaging', icon: MessageCircle, description: 'Send to team' },
    { id: 'export', label: 'Export', icon: Download, description: 'Download files' },
    { id: 'link', label: 'Link', icon: Link, description: 'Shareable link' },
    { id: 'print', label: 'Print', icon: Printer, description: 'Print report' }
  ];

  useEffect(() => {
    generatePreview();
  }, [selectedTab, matchData, shareConfig]);

  const generatePreview = () => {
    const content = generateShareContent(matchData, selectedTab, shareConfig);
    setPreview(content);
  };

  const generateShareContent = (data, tab, config) => {
    const date = new Date(data.timestamp).toLocaleDateString();
    const score = `${data.myScore}-${data.opponentScore}`;
    
    switch (tab) {
      case 'email':
        return {
          subject: `Match Report: ${data.opponentName} (${score}) - ${date}`,
          body: generateEmailBody(data),
          attachments: config.includeCSV ? [generateCSV(data)] : []
        };
      
      case 'social':
        return {
          message: `Great game vs ${data.opponentName}! Final: ${score} #sidelinestats #sportsanalytics`,
          hashtags: ['sidelinestats', 'sportsanalytics', 'matchreport'],
          image: config.includeImage
        };
      
      case 'messaging':
        return {
          text: `Match Report: ${data.opponentName} (${score})\n\nEvents:\n${data.events.map(e => `[${e.gameTime}] ${e.type}: ${e.label}`).join('\n')}`,
          includeFile: config.includeFile
        };
      
      case 'export':
        return {
          formats: ['csv', 'json', 'pdf'],
          selectedFormat: config.format || 'csv'
        };
      
      case 'link':
        return {
          url: `${window.location.origin}/shared/${data.id}`,
          expiresIn: '7 days'
        };
      
      case 'print':
        return {
          title: `Match Report: ${data.opponentName}`,
          content: generatePrintContent(data)
        };
      
      default:
        return null;
    }
  };

  const generateEmailBody = (data) => {
    const events = data.events.map(e => 
      `[${e.gameTime}] ${e.type} (${e.team === 'us' ? 'Us' : 'Them'}): ${e.label || 'Unnamed'}`
    ).join('\n');

    return `
Match Summary
=============
Opponent: ${data.opponentName}
Date: ${new Date(data.timestamp).toLocaleDateString()}
Final Score: ${data.myScore} - ${data.opponentScore}
Duration: ${data.finalTime || 'N/A'}

Events:
${events}

Statistics:
- Our Goals: ${data.events.filter(e => e.type === 'goal' && e.team === 'us').length}
- Their Goals: ${data.events.filter(e => e.type === 'goal' && e.team === 'them').length}
- Total Events: ${data.events.length}

Data file attached for detailed analysis.
    `.trim();
  };

  const generateCSV = (data) => {
    const headers = ['Time', 'Type', 'Team', 'Label', 'PK'];
    const rows = data.events.map(e => [
      e.gameTime,
      e.type,
      e.team === 'us' ? 'Us' : 'Them',
      e.label || '',
      e.meta?.isPK ? 'Yes' : 'No'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    return new File([csvContent], `match-report-${Date.now()}.csv`, { type: 'text/csv' });
  };

  const generatePrintContent = (data) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Match Report: ${data.opponentName}</h1>
        <p>Date: ${new Date(data.timestamp).toLocaleDateString()}</p>
        <p>Final Score: ${data.myScore} - ${data.opponentScore}</p>
        
        <h2>Events</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left;">Time</th>
              <th style="padding: 10px; text-align: left;">Type</th>
              <th style="padding: 10px; text-align: left;">Team</th>
              <th style="padding: 10px; text-align: left;">Label</th>
            </tr>
          </thead>
          <tbody>
            ${data.events.map(e => `
              <tr>
                <td style="padding: 10px;">${e.gameTime}</td>
                <td style="padding: 10px;">${e.type}</td>
                <td style="padding: 10px;">${e.team === 'us' ? 'Us' : 'Them'}</td>
                <td style="padding: 10px;">${e.label || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await executeShare(selectedTab, preview, shareConfig);
      setShareResult({ success: true, message: 'Shared successfully!' });
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setShareResult({ success: false, message: 'Share failed. Please try again.' });
    } finally {
      setIsSharing(false);
    }
  };

  const executeShare = async (tab, content, config) => {
    switch (tab) {
      case 'email':
        return shareEmail(content, config);
      case 'social':
        return shareSocial(content, config);
      case 'messaging':
        return shareMessaging(content, config);
      case 'export':
        return exportFile(content, config);
      case 'link':
        return shareLink(content, config);
      case 'print':
        return printReport(content, config);
      default:
        throw new Error(`Unknown share tab: ${tab}`);
    }
  };

  const shareEmail = (content, config) => {
    const params = new URLSearchParams({
      to: config.recipients?.join(',') || '',
      subject: content.subject,
      body: content.body
    });
    
    window.location.href = `mailto:${config.recipients?.join(',') || ''}?${params.toString()}`;
  };

  const shareSocial = (content, config) => {
    const platforms = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.message)}&hashtags=${content.hashtags.join(',')}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(content.message)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(content.message)}`
    };
    
    window.open(platforms[config.platform] || platforms.twitter, '_blank');
  };

  const shareMessaging = (content, config) => {
    const apps = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(content.text)}`,
      telegram: `https://t.me/share/url?text=${encodeURIComponent(content.text)}`
    };
    
    window.open(apps[config.app] || apps.whatsapp, '_blank');
  };

  const exportFile = (content, config) => {
    const file = generateCSV(matchData);
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareLink = (content, config) => {
    navigator.clipboard.writeText(content.url);
    setShareResult({ success: true, message: 'Link copied to clipboard!' });
  };

  const printReport = (content, config) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(content.content);
    printWindow.document.close();
    printWindow.print();
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
              preview={preview}
            />
          )}
          {selectedTab === 'social' && (
            <SocialShareTab 
              matchData={matchData}
              config={shareConfig}
              onConfigChange={setShareConfig}
              preview={preview}
            />
          )}
          {selectedTab === 'messaging' && (
            <MessagingShareTab 
              matchData={matchData}
              config={shareConfig}
              onConfigChange={setShareConfig}
              preview={preview}
            />
          )}
          {selectedTab === 'export' && (
            <ExportShareTab 
              matchData={matchData}
              config={shareConfig}
              onConfigChange={setShareConfig}
              preview={preview}
            />
          )}
          {selectedTab === 'link' && (
            <LinkShareTab 
              matchData={matchData}
              config={shareConfig}
              onConfigChange={setShareConfig}
              preview={preview}
            />
          )}
          {selectedTab === 'print' && (
            <PrintShareTab 
              matchData={matchData}
              config={shareConfig}
              onConfigChange={setShareConfig}
              preview={preview}
            />
          )}
        </div>

        {/* Share Actions */}
        <div className="share-actions">
          <button 
            onClick={handleShare}
            disabled={isSharing}
            className="btn-primary flex-1 min-h-[48px] font-semibold text-base"
          >
            {isSharing ? 'Sharing...' : 'Share'}
          </button>
          <button onClick={onClose} className="btn-secondary flex-1 min-h-[48px] font-semibold text-base">
            Cancel
          </button>
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

// Email Share Tab Component
const EmailShareTab = ({ matchData, config, onConfigChange, preview }) => {
  const [recipients, setRecipients] = useState(config.recipients || []);
  const [template, setTemplate] = useState('professional');
  const [includeCSV, setIncludeCSV] = useState(true);

  useEffect(() => {
    onConfigChange({ ...config, recipients, template, includeCSV });
  }, [recipients, template, includeCSV]);

  const addRecipient = (email) => {
    setRecipients([...recipients, email]);
  };

  return (
    <div className="email-share-tab">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Recipients</h4>
          <div className="flex flex-wrap gap-2">
            {recipients.map((email, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {email}
                <button 
                  onClick={() => setRecipients(recipients.filter((_, i) => i !== index))}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <input
            type="email"
            placeholder="Add email address"
            className="w-full mt-2 px-3 py-2 border rounded-lg"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                addRecipient(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>

        <div>
          <h4 className="font-semibold mb-2">Email Options</h4>
          <div className="space-y-2">
            <select 
              value={template} 
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="detailed">Detailed</option>
            </select>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeCSV}
                onChange={(e) => setIncludeCSV(e.target.checked)}
                className="mr-2"
              />
              Include CSV attachment
            </label>
          </div>
        </div>

        {preview && (
          <div>
            <h4 className="font-semibold mb-2">Preview</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm">
                <strong>Subject:</strong> {preview.subject}
              </div>
              <div className="mt-2">
                <strong>Body:</strong>
                <pre className="text-xs mt-1 whitespace-pre-wrap">{preview.body}</pre>
              </div>
              {preview.attachments.length > 0 && (
                <div className="mt-2 text-sm">
                  <strong>Attachments:</strong>
                  {preview.attachments.map(file => (
                    <span key={file.name} className="ml-2">
                      📎 {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Social Share Tab Component
const SocialShareTab = ({ matchData, config, onConfigChange, preview }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('twitter');
  const [customMessage, setCustomMessage] = useState('');
  const [includeImage, setIncludeImage] = useState(true);

  useEffect(() => {
    onConfigChange({ ...config, platform: selectedPlatform, customMessage, includeImage });
  }, [selectedPlatform, customMessage, includeImage]);

  const platforms = [
    { id: 'twitter', name: 'Twitter', icon: Twitter },
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin }
  ];

  return (
    <div className="social-share-tab">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Choose Platform</h4>
          <div className="grid grid-cols-3 gap-2">
            {platforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`p-3 border rounded-lg text-center ${
                  selectedPlatform === platform.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <platform.icon size={24} className="mx-auto mb-1" />
                <span className="text-xs">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Message</h4>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Add your personal message..."
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeImage}
              onChange={(e) => setIncludeImage(e.target.checked)}
              className="mr-2"
            />
            Include match summary image
          </label>
        </div>

        {preview && (
          <div>
            <h4 className="font-semibold mb-2">Preview</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm">
                {preview.message}
              </div>
              {preview.hashtags && (
                <div className="mt-2 text-blue-600">
                  {preview.hashtags.map(tag => `#${tag}`).join(' ')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Other tab components (Messaging, Export, Link, Print) would follow similar patterns...

const MessagingShareTab = ({ matchData, config, onConfigChange, preview }) => (
  <div className="messaging-share-tab">
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">Choose App</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-3 border rounded-lg text-center border-green-500 bg-green-50">
            <MessageCircle size={24} className="mx-auto mb-1 text-green-600" />
            <span className="text-xs">WhatsApp</span>
          </button>
          <button className="p-3 border rounded-lg text-center border-blue-500 bg-blue-50">
            <MessageCircle size={24} className="mx-auto mb-1 text-blue-600" />
            <span className="text-xs">Telegram</span>
          </button>
        </div>
      </div>
      
      {preview && (
        <div>
          <h4 className="font-semibold mb-2">Preview</h4>
          <div className="bg-gray-50 p-3 rounded-lg">
            <pre className="text-xs whitespace-pre-wrap">{preview.text}</pre>
          </div>
        </div>
      )}
    </div>
  </div>
);

const ExportShareTab = ({ matchData, config, onConfigChange, preview }) => (
  <div className="export-share-tab">
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">Export Format</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="radio" name="format" value="csv" defaultChecked className="mr-2" />
            CSV (Spreadsheet)
          </label>
          <label className="flex items-center">
            <input type="radio" name="format" value="json" className="mr-2" />
            JSON (Data)
          </label>
          <label className="flex items-center">
            <input type="radio" name="format" value="pdf" className="mr-2" />
            PDF (Report)
          </label>
        </div>
      </div>
    </div>
  </div>
);

const LinkShareTab = ({ matchData, config, onConfigChange, preview }) => (
  <div className="link-share-tab">
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">Shareable Link</h4>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm font-mono break-all">{preview?.url}</div>
          <div className="text-xs text-gray-500 mt-1">Expires in {preview?.expiresIn}</div>
        </div>
      </div>
    </div>
  </div>
);

const PrintShareTab = ({ matchData, config, onConfigChange, preview }) => (
  <div className="print-share-tab">
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">Print Preview</h4>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm">
            <strong>{preview?.title}</strong>
            <div className="mt-2 text-xs text-gray-600">
              {preview?.content ? 'Content ready for printing' : 'Generating preview...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
