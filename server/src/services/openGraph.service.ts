import ApiError from "../errors/apiError";
import * as cheerio from 'cheerio';

class OpenGraphService {
    public getMetaData = async (url: string) => {
        const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                },
            }
        );

        if (!res.ok) throw ApiError.badRequest(`Failed to fetch: ${res.statusText}`);

        const html = await res.text();
        const $ = cheerio.load(html);

        const ogTags: Record<string, string> = {};

        $('meta').each((_, el) => {
            const property = $(el).attr('property');
            const content = $(el).attr('content');

            if (property?.startsWith('og:') && content) {
                ogTags[property] = content;
            }
        });

        return {
            siteName: ogTags['og:site_name'],
            title: ogTags['og:title'],
            description: ogTags['og:description'],
            image: ogTags['og:image'],
            url: ogTags['og:url'],
        };
    }
}

export default OpenGraphService