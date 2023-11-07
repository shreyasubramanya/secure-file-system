
class FileStorage:
    def __init__(self):
        self.files = []

    def add_file(self, file):
        self.files.append(file)

    def delete_file(self, file):
        self.files.remove(file)
