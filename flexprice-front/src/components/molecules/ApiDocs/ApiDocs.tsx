import { FC } from 'react';
import { ApiDocsSnippet } from '@/store/useApiDocsStore';

const ApiDocs: FC = () => {
	return null;
};

interface ApiDocsContentProps {
	tags?: string[];
	snippets?: ApiDocsSnippet[];
}

export const fetchApidocsJson = async (): Promise<any> => {
	return {};
};

export const ApiDocsContent: FC<ApiDocsContentProps> = () => {
	return null;
};

export default ApiDocs;
