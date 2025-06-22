<?php
header('Content-Type: application/json');

$bloom = isset($_GET['bloom']) ? (bool)$_GET['bloom'] : false;
$color = $bloom ? '#ff69b4' : '#a3e635';
$scale = $bloom ? 1.2 : 1.0;
$svg = '<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <g transform="scale('.$scale.') translate('.(60-60/$scale).', '.(60-60/$scale).')">
    <circle cx="60" cy="60" r="20" fill="#fffde4" />
    <g>
      <ellipse cx="60" cy="35" rx="12" ry="24" fill="'.$color.'"/>
      <ellipse cx="60" cy="85" rx="12" ry="24" fill="'.$color.'"/>
      <ellipse cx="35" cy="60" rx="24" ry="12" fill="'.$color.'"/>
      <ellipse cx="85" cy="60" rx="24" ry="12" fill="'.$color.'"/>
    </g>
    <circle cx="60" cy="60" r="10" fill="#facc15" />
  </g>
</svg>';

echo json_encode([
  'svg' => $svg,
  'bloom' => $bloom
]);
