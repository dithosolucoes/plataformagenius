
import React from 'react';
import { SiteJsonNode } from '../types';

interface SiteRendererProps {
  node: SiteJsonNode | string;
}

const SiteRenderer: React.FC<SiteRendererProps> = ({ node }) => {
  if (typeof node === 'string') {
    return <>{node}</>;
  }

  if (!node || typeof node.type !== 'string') {
    console.error('Invalid node structure:', node);
    return <div className="text-red-500">Error: Invalid element structure found.</div>;
  }
  
  const { type, props = {}, children = [] } = node;

  return React.createElement(
    type,
    props,
    children.map((child, index) => (
      <SiteRenderer key={index} node={child} />
    ))
  );
};

export default SiteRenderer;
