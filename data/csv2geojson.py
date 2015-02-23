from geojson import Feature, Point, FeatureCollection, dumps

with open('geometries.tsv') as f:
	header = f.readline().rstrip('\n').split('\t')
	print header

	features = []

	for line in f.readlines():
		properties = line.rstrip('\n').split('\t')
		print properties

		try: 
			lat = float(properties[header.index('latitude')])
			lon = float(properties[header.index('longitude')])
		except ValueError:
			 lat = 0.0
			 lon = 0.0

		print lat
		print lon
		print
		geometry = Point((lon, lat))

		#print properties
		properties = dict(zip(header, properties))
		print properties['Afbeelding']
		#print properties

		features.append(Feature(geometry=geometry, properties=properties))

featureCollection = FeatureCollection(features)

with open('geometries.json', 'w') as f:
	f.write(dumps(featureCollection))