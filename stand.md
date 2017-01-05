# stand der dinge

aktuell: zenon-ID korrekt importieren

* scheitert am plugin-registry-problem

	Your import file contains a dataset with an ID-type 'other::zenon' that no ID-plugin can handle. Please install and/or activate the corresponding ID plug-in before trying to import this dataset.

dann:

* upload-ID importieren: entsprechendes mini-plugin bauen (evtl. kann man das im zenonlink-plugin mit-integrieren)

=> get ja nicht, weil nicht eindeutig und dann würde sich ein plugin weigern

=> also anders:

[A - setting von dfm aus setzen]
DFM macht Markierung (article-setting) setting hasCover und beim addCover mdous werden alle mit markierung übersprungen
-> nach dem import würden alle ein neues cover bekommen, die keine markierung haben
	-> beim den schon-importierten muss man die markierung nachtragen 
		=> kein großes Problem
-> Problem bei gemischten Journals
		=> großer Nachteil!
		
		
[B - anderes Feld missbrauchen]
man kann andere Felder missbrauchen, um dem system zu sagen, dass die Seite ein cover braucht,
und dann beim cover erstellen verschönern
	-> kann man nicht mit boardmitteln abfragen
		=> uärgh
		
[C - importer bearbeiten]
den importer entsprechend anpassen...
		=> super viel arbeit und ein neues plugin
		
[D - eine eigene pubid setzen als marker]
doch den ursprünglichen Plan und nicht upload-Id reinsetzen sondern ein random Wert. nachher nur abfragen, ob dieses Ding gesetzt ist
und dann leeren.
	-> man muss doch wieder ein eigenes Plugin ohne echte funktion machen... 

[E - zenonID missbrauchen?]
man könnte an die zenon-ID einen marker hängen
	-> beim sammeln würde man alle mit zenon-ID suchen und dann filtern, wer den marker hat
		=> gut

