
import React, { useState, useEffect } from 'react';
import { SiteData, SiteJsonNode } from '../types';
import { generateSiteJson } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const placeholderJson: SiteJsonNode = {
  type: "div",
  props: { className: "bg-gray-900 text-white min-h-screen p-8 font-sans" },
  children: [
    {
      type: "div",
      props: { className: "text-center" },
      children: [
        { type: "h1", props: { className: "text-5xl font-bold text-blue-400 mb-4" }, children: ["Welcome to My Awesome Site"] },
        { type: "p", props: { className: "text-lg text-gray-300" }, children: ["This is a site generated from a JSON blueprint."] },
      ]
    }
  ]
};

const mockSites: SiteData[] = [
  { id: 1, user_id: 1, site_title: "My Personal Blog", site_content_json: placeholderJson, created_at: new Date().toISOString() },
  { id: 2, user_id: 1, site_title: "Project Phoenix Showcase", site_content_json: placeholderJson, created_at: new Date().toISOString() },
];

const DashboardPage: React.FC = () => {
  const [siteTitle, setSiteTitle] = useState('');
  const [siteJson, setSiteJson] = useState(JSON.stringify(placeholderJson, null, 2));
  const [aiPrompt, setAiPrompt] = useState('');
  const [sites, setSites] = useState<SiteData[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  
  useEffect(() => {
    // In a real app, fetch user's sites here.
    setSites(mockSites);
  }, []);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSiteJson(e.target.value);
    setError('');
  };
  
  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    setNotification('');
    try {
      const parsedJson = JSON.parse(siteJson);
      // Mock API call
      console.log("Creating site:", { site_title: siteTitle, site_content_json: parsedJson });
      setTimeout(() => {
        const newSite: SiteData = {
            id: Date.now(),
            user_id: 1,
            site_title: siteTitle || "Untitled Site",
            site_content_json: parsedJson,
            created_at: new Date().toISOString(),
        };
        setSites(prev => [newSite, ...prev]);
        setNotification(`Site "${newSite.site_title}" created successfully!`);
        setSiteTitle('');
        setIsCreating(false);
      }, 1000);
    } catch (err) {
      setError("Invalid JSON format. Please check your syntax.");
      setIsCreating(false);
    }
  };

  const handleGenerateWithAI = async () => {
      if (!aiPrompt.trim()) {
          setError("Please enter a description for the AI.");
          return;
      }
      setIsGenerating(true);
      setError('');
      setNotification('');
      try {
          const generatedJson = await generateSiteJson(aiPrompt);
          setSiteJson(JSON.stringify(generatedJson, null, 2));
          setNotification("AI successfully generated site structure!");
      } catch (err: any) {
          setError(err.message || "An error occurred while generating with AI.");
      } finally {
          setIsGenerating(false);
      }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold mb-6 tracking-tight">Dashboard</h1>

      {notification && <div className="bg-secondary-success/20 border border-secondary-success text-secondary-success p-3 rounded-md mb-6">{notification}</div>}
      {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-md mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-foreground rounded-lg border border-border-color">
                <h2 className="text-2xl font-semibold mb-4 text-text-main">1. Generate with AI (Optional)</h2>
                <div className="space-y-4">
                    <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g., 'a modern portfolio for a photographer named Jane Doe, with a gallery section'"
                        className="w-full h-24 p-3 bg-background border border-border-color rounded-md focus:ring-2 focus:ring-primary-accent focus:outline-none transition-shadow"
                    />
                    <button onClick={handleGenerateWithAI} disabled={isGenerating} className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-md text-white bg-secondary-success hover:bg-green-700 disabled:bg-gray-600 transition-colors">
                        {isGenerating ? <LoadingSpinner /> : '✨ Generate Structure'}
                    </button>
                </div>
            </div>
          <form onSubmit={handleCreateSite} className="p-6 bg-foreground rounded-lg border border-border-color">
            <h2 className="text-2xl font-semibold mb-4 text-text-main">2. Define & Create Your Site</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                placeholder="Site Title (e.g., My Awesome Site)"
                required
                className="w-full p-3 bg-background border border-border-color rounded-md focus:ring-2 focus:ring-primary-accent focus:outline-none transition-shadow"
              />
              <textarea
                value={siteJson}
                onChange={handleJsonChange}
                placeholder="Paste your site's master JSON here..."
                className="w-full h-96 p-3 bg-background border border-border-color rounded-md font-mono text-sm focus:ring-2 focus:ring-primary-accent focus:outline-none transition-shadow"
              />
              <button type="submit" disabled={isCreating} className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-md text-white bg-primary-accent hover:bg-blue-700 disabled:bg-gray-600 transition-colors">
                {isCreating ? <LoadingSpinner /> : 'Create System'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="lg:col-span-1">
          <div className="p-6 bg-foreground rounded-lg border border-border-color">
            <h2 className="text-2xl font-semibold mb-4 text-text-main">Your Sites</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {sites.length > 0 ? sites.map(site => (
                <div key={site.id} className="p-4 bg-background rounded-md border border-border-color hover:border-primary-accent transition-colors group">
                  <h3 className="font-bold text-text-main">{site.site_title}</h3>
                  <p className="text-sm text-text-secondary">Created: {new Date(site.created_at).toLocaleDateString()}</p>
                  <Link to={`/site/${site.id}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-accent hover:underline mt-2 inline-block">
                    View Live Site &rarr;
                  </Link>
                </div>
              )) : (
                <p className="text-text-secondary">You haven't created any sites yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
