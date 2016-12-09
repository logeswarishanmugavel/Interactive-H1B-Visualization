# Interactive Data Visualization using python, D3.js and mongodb

## Getting started

The dependencies required to run the project could be installed using

	$pip install requirements.txt

To get the data,
	
	$python gettingdataready.py

Once the data is ready, to start the application,

	$python app.py

## File descriptions

<table>
<tr>
<th> Name of the file</th>
<th> Description</th>
</tr>
<tr> 
<td>2016.csv</td>
<td>Dataset </td>
</tr>
<tr> 
<td> gettingdataready.py</td>
<td> Filters the unwanted data and stores the required data under a new collection. This file has to be run first, before starting the application. 
</td>
</tr>
<tr>
<td>output.json</td>
<td>Contains a copy of the new collection made after filtering.</td>
</tr>
<tr>
<td>app.py</td>
<td>The server file that runs the flask.</td>
</tr>
<tr>
<td>templates/index.html</td>
<td>The html file created for front end design.</td>
</tr>
<tr>
<td>static/css/custom.css</td>
<td>The CSS file that provides custom formatting to the page.</td>
</tr>
<tr>
<td>static/js/graphs.js</td>
<td>The javascript file that contains the d3 code corresponding to the visualizations. </td>
</tr>
<tr >
<td colspan=2 style = 'text-align:center'><b> Library files</b> </td>
</tr>
<td>static/data/us.json</td>
<td>Contains the geographical details of US states.</td>
</tr>
<tr>
<td>static/data/us-state-names.tsv</td>
<td>Contains the short and full form of US state names.</td>
</tr>
</table>
