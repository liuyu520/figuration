const fs = require('fs');
const prism = require('prismjs');
const prismLoader = require('prismjs/components/index.js');
const slugify = require('slugify');
const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItToc = require('markdown-it-toc-done-right');

module.exports = function(eleventyConfig) {
    eleventyConfig.setDataDeepMerge(true);

    // Filters
    eleventyConfig.addFilter('sitemapDateString', (dateObj) => {
        return new Date(dateObj).toISOString();
    });
    eleventyConfig.addFilter('pathLast', (str) => {
        let array = str.replace(/\/$/, '').split('/');
        let val = array[array.length - 1];
        return (typeof val === undefined) ? '' : val;
    });
    eleventyConfig.addFilter('valueIfEmpty', function() {
        let len = arguments.length;
        for (let i = 0; i < len; i++) {
            if (typeof arguments[i] !== 'undefined') {
                return arguments[i];
            }
        }
        return false;
    });

    // Markdown plugins
    const slugifyHeading = s => slugify(s, {lower: true, remove: /[*+~.()'"!?:@\[\]\/]/g});
    const markdownItOptions = {
        html: true,
        breaks: true,
        linkify: true
    };
    const markdownItAnchorOptions = {
        slugify: slugifyHeading,
        permalink: true,
        permalinkClass: 'direct-link',
        permalinkSymbol: '#'
    };
    const markdownItTocOptions = {
        slugify: slugifyHeading,
        containerClass: 'cf-toc',
        listClass: 'cf-toc-list',
        itemClass: 'cf-toc-item',
        linkClass: 'cf-toc-link',
        listType: 'ul',
        level: 2
    };
    const md = new markdownIt();
    eleventyConfig.setLibrary('md', markdownIt(markdownItOptions)
        .use(markdownItAttrs)
        .use(markdownItAnchor, markdownItAnchorOptions)
        .use(markdownItToc, markdownItTocOptions)
    );

    // Use singular short codes for syntax highlights and examples
    // Work around issue with no parsing between paired shortcodes.
    eleventyConfig.addShortcode('renderHighlight', function(content, language) {
        let highlightedContent = content.trim();
        let lines = {};
        if(language !== 'text') {
            if(!prism.languages[language]) {
                prismLoader([language]);
            }
            highlightedContent = prism.highlight(highlightedContent, prism.languages[language]);
        }

        lines = highlightedContent.split('\n');
        return `<pre class="language-${language}"><code class="language-${language}">` + lines.join('<br>') + '</code></pre>';
    });

    eleventyConfig.addShortcode('renderExample', function(content, addClass, id) {
        let highlightedContent = content.trim();
        let lines = {};
        let output = '';
        let outputId = '';
        let parsedContent = '';
        addClass = (typeof addClass !== 'undefined') ? ' ' + addClass : '';

        // Strip out `holder.js` reference
        if (highlightedContent.includes('data-src="holder.js')) {
            parsedContent = highlightedContent.replace('data-src="holder.js', 'src="✂️holder.js');
            parsedContent = parsedContent.replace(/\" /g, '✂️" ');
            parsedContent = parsedContent.split('✂️');
            highlightedContent = '';
            parsedContent.forEach(function(str) {
                highlightedContent += str.includes('holder.js') ? '...' : str;
            });
        }

        // Send through PrismJS
        if(!prism.languages['html']) {
            prismLoader(['html']);
        }
        highlightedContent = prism.highlight(highlightedContent, prism.languages['html']);
        lines = highlightedContent.split('\n');
        content = content.replace(/\n\n/g, '\n');

        if (typeof id !== 'undefined') {
            outputId = ' id="' + id + '"';
        }
        output += `<div class="cf-example${addClass}"${outputId}>` + content + '</div>\n';
        output += '<pre class="language-html"><code class="language-html">' + lines.join('<br>') + '</code></pre>';
        return output;
    });

    eleventyConfig.addShortcode('renderCallout', function(content, level, addClass) {
        addClass = (typeof addClass !== 'undefined') ? ' ' + addClass : '';
        // Add preceding newline improve markup output
        content = md.renderInline('\n' + content);
        return `<div class="cf-callout cf-callout-${level}${addClass}">${content}</div>`;
    });

    // BrowserSync configuration and 404 page
    eleventyConfig.setBrowserSyncConfig({
        notify: true,
        callbacks: {
            ready: function(err, browserSync) {
                const content_404 = fs.readFileSync('_siteout/404.html');

                browserSync.addMiddleware('*', (req, res) => {
                    // Provides the 404 content without redirect.
                    res.write(content_404);
                    res.end();
                });
            }
        }
    });

    // Layout aliases
    eleventyConfig.addLayoutAlias('home', 'layouts/home.html');
    eleventyConfig.addLayoutAlias('doc', 'layouts/doc.html');
    eleventyConfig.addLayoutAlias('alias', 'layouts/alias.html');

    // Static assets
    eleventyConfig.addPassthroughCopy('site/assets', 'assets');
    eleventyConfig.addPassthroughCopy('LICENSE', '/');

    eleventyConfig.setLiquidOptions({
        dynamicPartials: true
    });

    return {
        templateFormats: ['md', 'html', 'liquid'],
        markdownTemplateEngine: 'liquid',
        htmlTemplateEngine: 'liquid',
        dataTemplateEngine: 'liquid',
        passthroughFileCopy: true,

        pathPrefix: '/',
        dir: {
            input: 'site',
            output: '_siteout',
            includes: '_includes',
            data: '_data'
        }
    };
};
