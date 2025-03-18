import os

def process_fna(fna_path):
    with open(fna_path, 'r') as fna:
        sequences = fna.read().split('>')
        for sequence in sequences:
            if not sequence.strip():
                continue

            sequence_parts = sequence.split('\n', 1)
            header = sequence_parts[0].split(' ')
            chromosome = header[6]
            if chromosome == '4':
                sequence_data = ''.join(sequence_parts[1:]).strip()
                parts = os.path.basename(fna_path).split('_')
                new_file_name = parts[0] + '_' + parts[1] + '_' + chromosome + '.fa'
                new_file_path = os.path.join(os.path.dirname(fna_path), new_file_name)
                with open(new_file_path, 'w') as new_file:
                    new_file.write('>' + sequence_parts[0].strip() + '\n' + sequence_data)

current_directory = os.getcwd()
for file in os.listdir(current_directory):
    if file.endswith(".fna"):
        process_fna(os.path.join(current_directory, file))