<table>
	<tr>
		<td>File</td>
		<td>
			<div id="file_container">
				<input type="file" name="tileset_file">
				<input type="button" name="tileset_file_overlay" value="choose tileset"></div>
			</div>
		</td>
	</tr>
	<tr>
		<td>Tile Width</td>
		<td><input type="number" name="tile_width" value="32"></td>
	</tr>
	<tr>
		<td>Tile Height</td>
		<td><input type="number" name="tile_height" value="32"></td>
	</tr>
	<tr>
		<td>Tile Margin</td>
		<td><input type="number" name="tile_margin" value="0"></td>
	</tr>
	<tr>
		<td><span class="hint" title="If desired, specify a color in HEX or RGB format which will later become transparent.">Tile Alpha</span></td>
		<td><input type="text" name="tile_alpha" value="" maxlength="11" placeholder="hex / rgb"></td>
	</tr>
	<tr>
		<td colspan="2"><input type="button" value="add tileset" id="tilesets_add"></td>
	</tr>
</table>