# Dynamic Features & Backend Integration Plan

This document outlines the blueprint and specifications for programmatically handling the dynamic components of your website that were removed during the static site reorganization. Since the static site is now 100% independent of WordPress, you can implement these features using lightweight serverless solutions, a simple Node/Python/PHP backend, or static forms services.

---

## 1. Contact Form Backend Integration

The WordPress `WPForms` plugin has been replaced in `/contact/index.html` with a beautiful, clean, modern static HTML5 form:
```html
<form action="submit_form.php" id="contact-form" class="flex flex-col gap-6 w-full max-w-xl mx-auto my-8 font-montserrat" method="POST">
    <!-- inputs for name, email, message -->
</form>
```

### Option A: Serverless & Third-Party Forms (Zero Backend Code)
If you want to host this site on static platforms (like Netlify, Vercel, GitHub Pages, or Cloudflare Pages) without writing a server-side backend:
1. **Netlify Forms**: Just add a `data-netlify="true"` attribute to the `<form>` element. Netlify will automatically detect it and parse form submissions.
2. **Formspree**: Change the form's `action` to point to Formspree's endpoint:
   ```html
   <form action="https://formspree.io/f/{your_form_id}" method="POST">
   ```
3. **Web3Forms**: A premium, highly customizable, free key-based handler.

### Option B: Custom PHP Script (`submit_form.php`)
If you deploy on a standard Linux/Apache server and want complete privacy/control:
Create a file named `submit_form.php` in the root of the site:
```php
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please complete the form correctly.";
        exit;
    }

    $recipient = "me@nimazomorrodi.com";
    $subject = "New Portfolio Message from $name";
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";
    $email_headers = "From: $name <$email>";

    if (mail($recipient, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo "Thank you! Your message has been sent.";
    } else {
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
    }
} else {
    http_response_code(403);
    echo "There was a problem with your submission.";
}
?>
```

---

## 2. Blog Comment System Integration

In the blog posts, the complex WordPress comment forms have been replaced with a clean HTML structure targeting a standard `submit_comment.php` action.

### Option A: Disqus or Commento (Modern Embedded Comments)
The standard way for premium static portfolios to handle blog comments is using an embedded script:
1. Register your site on **Disqus**.
2. Replace the comment form block in each article index page with the Disqus thread container:
   ```html
   <div id="disqus_thread"></div>
   <script>
       var disqus_config = function () {
           this.page.url = window.location.href;
           this.page.identifier = window.location.pathname;
       };
       (function() {
           var d = document, s = d.createElement('script');
           s.src = 'https://{your-disqus-subdomain}.disqus.com/embed.js';
           s.setAttribute('data-timestamp', +new Date());
           (d.head || d.body).appendChild(s);
       })();
   </script>
   ```

### Option B: Lightweight Node.js/Express Comment API
If you want to store comments in a lightweight local SQLite database:
1. Build a simple Express API:
   ```javascript
   app.post('/api/comments', (req, res) => {
       const { post_id, author, comment } = req.body;
       db.run(`INSERT INTO comments (post_id, author, comment, date) VALUES (?, ?, ?, datetime('now'))`, 
           [post_id, author, comment], (err) => {
               if (err) return res.status(500).send(err);
               res.status(200).send('Comment added successfully!');
           });
   });
   ```
2. In the HTML pages, use standard `fetch()` in JS to fetch comments for that specific post ID and display them asynchronously!

---

## 3. SEO, Meta Data & Analytics

During the static export:
1. **Google Analytics / Consent Mode**: The Site Kit and Consent Mode configuration script (`googlesitekit-consent-mode-da15714e8829855bb7ce.js`) has been ported to `assets/js/`.
2. **Dynamic XML Sitemap**: You can generate a standard static sitemap (`sitemap.xml`) to submit to Google Search Console since there is no dynamic WordPress core to rebuild it on the fly.
