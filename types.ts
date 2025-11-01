// FIX: Import 'react' to make the JSX namespace available for types.
import 'react';

export interface SiteJsonNode {
  type: keyof JSX.IntrinsicElements;
  props?: { [key: string]: any; className?: string };
  children?: (SiteJsonNode | string)[];
}

export interface SiteData {
  id: number;
  user_id: number;
  site_title: string;
  site_content_json: SiteJsonNode;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
