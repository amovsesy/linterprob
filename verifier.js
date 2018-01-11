verifier = {
	
			knight: '<p class="piece">&#9822</p>',
			rook: '<p class="piece">&#9820</p>',
			bishop: '<p class="piece">&#9821</p>',
			total_pieces: 0,
			valid_board: true,
			
			build_board: function(m,n) {
				var tbl = '<table id="board">';
				for(var i = 0; i < m; i++){
					tbl += '<tr>';
					for(var j = 0; j < n; j++){
						tbl += '<td class="c' + ((i+j)%2) + '" id="p' + ((i*n)+j) + '">' + '<p style="padding-left: 25px; padding-top: 30px;" ></p></td>';
					}
					tbl += '</tr>';
				}
				tbl += '</table>';
				$('#result').html(tbl);
			},
			
			verify: function(input) {
				$("#message").html("");
				this.total_pieces = 0;
				this.valid_board = true;
				
				var parts = input.match(/^(\d+)\s+(\d+)\s+([KRBN]+)$/i);
				if(typeof parts !== 'undefined' && parts !== null && parts.length === 4) {
					if( (parseInt(parts[1]) * parseInt(parts[2])) === parts[3].length){
						this.build_board(parts[1], parts[2]);
						this.layout_pieces(parts[1], parts[2], parts[3]);
						this.verify_solution(parts[1], parts[2], parts[3]);
						if(this.valid_board)
							$("#message").html('<p class="success">This board is valid with <strong>' + this.total_pieces + '</strong> pieces!</p>');
						else
							$("#message").html('<p class="error">Sorry, this board is invalid! The red cells represent pieces that are current being attacked by other pieces.</p>');
					} else {
						$('#result').html('<p class="error">Board size of ' 
							+ parts[1] + 'x' + parts[2] + ' does not have enough pieces in the list, expecting length: ' 
							+ ( parseInt(parts[1]) * parseInt(parts[2]) ) 
							+ ', had length: ' + parts[3].length + '.</p>'
						);
					}
				} else
					$('#result').html('<p class="error">Input is not a valid format</p>');	
			},
			
			verify_solution: function(m,n,pieces){
					for(var i = 0; i < m; i++){
						for(var j = 0; j < n; j++){
							switch(pieces[((i*n)+j)].toUpperCase()){
								case 'K':
									this.check_spot(i-2,j-1,m,n,pieces);
									this.check_spot(i-2,j+1,m,n,pieces);
									this.check_spot(i+2,j-1,m,n,pieces);
									this.check_spot(i+2,j+1,m,n,pieces);
									this.check_spot(i-1,j-2,m,n,pieces);
									this.check_spot(i+1,j-2,m,n,pieces);
									this.check_spot(i-1,j+2,m,n,pieces);
									this.check_spot(i+1,j+2,m,n,pieces);
									break;
								case 'B':
									var a = i; var b = j;
									while(--a >= 0 && --b >= 0){
										this.check_spot(a,b,m,n,pieces);
									}
									
									a = i; b = j;
									while(--a >= 0 && ++b < n){
										this.check_spot(a,b,m,n,pieces);
									}
									
									a = i; b = j;
									while(++a < m  && --b >= 0){
										this.check_spot(a,b,m,n,pieces);
									}
									
									a = i; b = j;
									while(++a < m  && ++b < n){
										this.check_spot(a,b,m,n,pieces);
									}
									
									break;
								case 'R':
									for(a=0;a<m;a++){
										if(a != i)
											this.check_spot(a,j,m,n,pieces);
									}
									
									for(b=0;b<n;b++){
										if(b != j)
											this.check_spot(i,b,m,n,pieces);
									}
									break;
							}
						}	
					}
			},
			
			check_spot: function(i,j,m,n,pieces){
				if(i < 0 || j < 0 || i >= m || j >= n)
					return;
				if(pieces[((i*n)+j)].toUpperCase() !== 'N') {
					this.valid_board = false;
					$('#p' + ((i*n)+j)).css('color','red');
				}
			},
			
			layout_pieces: function(m,n,pieces){
				for(var i = 0; i < m; i++){
					for(var j = 0; j < n; j++){
						 switch(pieces[((i*n)+j)].toUpperCase()){
							case 'K':
								$('#p' + ((i*n)+j)).html(this.knight);
								this.total_pieces++;
								break;
							case 'B':
								$('#p' + ((i*n)+j)).html(this.bishop);
								this.total_pieces++;
								break;
							case 'R':
								$('#p' + ((i*n)+j)).html(this.rook);
								this.total_pieces++;
								break;
						}
					}
				}
			}
};


$(document).ready(function() {
  $("#verify").click(function() {
	verifier.verify($("#inputdata").val())
  });
});
