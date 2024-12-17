import paramiko
import os
import sys
from stat import S_ISDIR


def recursive_download(sftp, remote_dir, local_dir):
    """递归下载远程文件夹"""
    # 如果本地文件夹不存在，则创建
    if not os.path.exists(local_dir):
        os.makedirs(local_dir)
    
    # 遍历远程文件夹中的所有文件
    for file_attr in sftp.listdir_attr(remote_dir):
        remote_file = remote_dir + "/" + file_attr.filename
        local_file = os.path.join(local_dir, file_attr.filename)
        
        if S_ISDIR(file_attr.st_mode):  # 如果是目录，递归下载
            recursive_download(sftp, remote_file, local_file)
        else:  # 如果是文件，下载文件
            sftp.get(remote_file, local_file)
            print(f"Downloaded: {remote_file} -> {local_file}")


def execute_command(input_file):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())  # 自动接受未验证的服务器
    ssh.connect('10.137.143.11', username='yxxiang', password='xiangyixin0729')  # 连接主服务器

    # 主服务器的目标路径
    filename = os.path.basename(input_file).replace('.gfa', '')  # 获取文件名并去掉 .gfa
    input_path = f'./data/GFAKaleidos/data/{filename}.gfa'
    output_path = f'./data/GFAKaleidos/result/{filename}'

    # 使用 SFTP 上传文件到主服务器
    sftp = ssh.open_sftp()

    # 上传文件
    sftp.put(input_file, input_path)
    sftp.close()

    # 执行命令
    command = "./data/GFAKaleidos/algorithm/gfaKaleidos.exe {} -o {} -t 16".format(input_path, output_path)
    stdin, stdout, stderr = ssh.exec_command(command)

    # 打印命令的输出
    print(stdout.read().decode())
    print(stderr.read().decode())

    # 下载生成的结果文件
    sftp = ssh.open_sftp()
    local_output_dir = f'./data/{filename}'

    try:
        recursive_download(sftp, output_path, local_output_dir)
        print(f"Successfully downloaded the entire folder: {output_path} to {local_output_dir}")
    except Exception as e:
        print(f"Failed to download folder: {e}")

    sftp.close()
    ssh.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 connect.py <input_path>")
        sys.exit(1)

    execute_command(sys.argv[1])
