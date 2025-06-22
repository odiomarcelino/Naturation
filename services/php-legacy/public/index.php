<?php
header('Content-Type: text/html');
?>
<!DOCTYPE html>
<html>
<head>
  <title>Legacy Nature View Source</title>
  <style>
    body { font-family: monospace; background:#111; color:#0f0; padding:2rem; }
  </style>
</head>
<body>
<h1>🌿 Legacy PHP Endpoint</h1>
<p>This demonstrates that even good old PHP can be part of our modern polyglot nature site on Vercel.</p>
<pre>
<?php echo htmlspecialchars(file_get_contents(__FILE__)); ?>
</pre>
</body>
</html>
