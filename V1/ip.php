<?php
// 获取用户的IP地址
if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}

// 文件存储路径
$file = 'visits.txt';

// 如果文件不存在，初始化计数
if (!file_exists($file)) {
    file_put_contents($file, 0);
}

// 读取当前计数
$count = (int) file_get_contents($file);

// 计数加一
$count++;

// 保存新的计数
file_put_contents($file, $count);

// 返回 JSON 数据
header('Content-Type: application/json');
echo json_encode([
    'ip' => $ip,
    'visits' => $count
]);
?>
