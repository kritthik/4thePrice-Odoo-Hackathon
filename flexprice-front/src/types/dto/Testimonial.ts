export interface Testimonial {
	companyTitleLogoUrl?: string;
	dpUrl: string;
	logoUrl: string;
	testimonial: string;
	name: string;
	designation: string;
	companyName: string;
	label?: string; // e.g., "Series A", "Series B", "YC 23", "YC 25"
	labelImageUrl?: string; // Image URL for label (e.g., Y Combinator logo)
}
