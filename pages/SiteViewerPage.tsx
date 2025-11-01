
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SiteJsonNode } from '../types';
import SiteRenderer from '../components/SiteRenderer';
import LoadingSpinner from '../components/LoadingSpinner';

const placeholderJson: SiteJsonNode = {
  type: "div",
  props: { className: "bg-gray-900 text-white min-h-screen p-8 font-sans flex items-center justify-center" },
  children: [
    {
      type: "div",
      props: { className: "text-center" },
      children: [
        { type: "h1", props: { className: "text-5xl font-bold text-blue-400 mb-4" }, children: ["Welcome to My Awesome Site"] },
        { type: "p", props: { className: "text-lg text-gray-300" }, children: ["This is a site generated from a JSON blueprint."] },
        {
          type: "div",
          props: { className: "mt-8" },
          children: [
            {
              type: "a",
              props: { href: "#", className: "px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition" },
              children: ["Get Started"]
            }
          ]
        }
      ]
    }
  ]
};

const SiteViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [siteContent, setSiteContent] = useState<SiteJsonNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteData = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real application, this would be an API call:
        // const response = await fetch(`/api/sites/${id}`);
        // if (!response.ok) throw new Error('Site not found');
        // const data = await response.json();
        // setSiteContent(data.site_content_json);

        // MOCKING the API call
        console.log(`Fetching site with ID: ${id}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        if (id) {
          setSiteContent(placeholderJson);
        } else {
          throw new Error('Site not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load site data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!siteContent) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-text-secondary">
        <p>No content to display for this site.</p>
      </div>
    );
  }

  return <SiteRenderer node={siteContent} />;
};

export default SiteViewerPage;
