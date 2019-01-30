import os
import shutil
import subprocess

from workers.latex.frontmatter.latex_metadata import LatexMetadata


class Frontmatter:

    metadata: dict
    LATEX_COMMANDS = {
        "article_title": "fmtitle",
        "article_author": "fmauthor",
        "article_abstract": "fmabstract",
        "journal_name": "fmjournal",
        "journal_subtitle": "fmjournalsubtitle",
        "journal_short_name": "fmshortjournal",
        "urn": "fmurn",
        "abbreviation": "fmstring",
        "pages": "fmpages",
        "year": "fmyear",
        "print_issn": "fmissn",
        "online_issn": "fmissnonline",
        "issue": "fmissue",
        "publisher": "fmpublisher",
        "included_pdf": "inputpdf",
        "language": "lang"
    }

    def __init__(self, obj):
        self.metadata = LatexMetadata(obj).to_dict()

    def build_command(self):
        options = ""
        for key in self.metadata:
            if not self.metadata[key]:
                continue
            if key in self.LATEX_COMMANDS:
                options += f"\\def\\{self.LATEX_COMMANDS[key]}" \
                    f"{{{self.metadata[key]}}}"
            else:
                raise KeyError(f"'{key}' does not seem to be a viable "
                               f"frontmatter attribute")
        path = os.path.abspath('')
        return f'cd /frontmatter && lualatex -interaction=nonstopmode ' \
            f'"{options}\\input{{frontmatter.tex}}" && cd {path}'

    def generate_frontmatter(self, target_path):
        command = self.build_command()
        print(command)
        return_code = subprocess.call(command, shell=True)
        if return_code != 0:
            raise Exception("Frontmatter generation failed! The log file can be"
                            " found under /frontmatter/frontmatter.log inside "
                            "the latex docker-container")
        shutil.copy('/frontmatter/frontmatter.pdf', target_path)
