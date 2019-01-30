from utils.serialization import SerializableClass


class LatexMetadata(SerializableClass):

    article_title: str
    article_author: str
    article_abstract: str

    pages: str
    year: int
    language: str

    def __init__(self, obj):
        metadata = obj.metadata
        parent_metadata = obj.get_parent().metadata

        self.article_title = metadata.get_attribute("title")
        self.set_authors(metadata.to_dict())
        self.article_abstract = metadata.get_attribute("abstract")

        self.pages = metadata.get_attribute("pages")["showndesc"]
        self.year = parent_metadata.get_attribute("year")

        self.language = metadata.get_attribute("language").replace('_', '-')

    def set_authors(self, metadata: dict):
        string = ""
        if "author" in metadata:
            authors = metadata["author"]
            for author in authors:
                string += f"{author['firstname']} {author['lastname']}"
                if authors.index(author) != len(authors) - 1:
                    string += " \u2013 "
            self.article_author = string
