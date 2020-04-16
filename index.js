const request = require("request");
const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

//inicia a função inicial de coleta de dados
main();

//função inicial
async function main() {
	//faz a pergunta de qual CPF deve ser consultado
	await rl.question("Informe o CPF a ser consultado: ", async (cpf) => {
		//exibe no terminal qual cpf foi capturado
		console.log("[*] Consultado CPF: " + cpf);

		//aguarda o retorno da função de validação de CPF
		var cpf_validate = await get_cpf_validate(Number(cpf));

		//exibe no terminal o retorno da validação do CPF
		console.log("[*] " + cpf_validate.mensagem);

		//verifica se o retorno veio sem erro
		if (cpf_validate.codigo == 200) {
			//faz nova pergunta para o cliente, pedindo o token
			rl.question("Informe o Token correspondente: ", async (token) => {
				//exibe no terminal qual token foi capturado
				console.log("[*] Verificando o Token : " + token);

				//aguarda o retorno da função de validação de token
				var token_validate = await get_token_validade(
					Number(cpf),
					token
				);

				//Verifica se o retorno de token apresenta erro
				if (token_validate.mensagem != undefined) {
					//exibe no terminal que a validação do token retornou erro
					console.log("[*] Erro encontrado:");

					//exibe retorno em forma de tabela
					console.table(token_validate);
				} else {
					//exibe no terminal que a validação do token foi aceita
					console.log("[*] Dados Retordados:");
					//exibe retorno em forma de tabela
					console.table(token_validate);
				}

				//finaliza processo de captura de teclas
				rl.close();
			});
		} else {
			//Caso aprensente erro
			console.log("[*] Erro encontrado:");
			//exibe retorno em forma de tabela
			console.table(cpf_validate);
			//finaliza processo de captura de teclas
			rl.close();
		}
	});
}

function get_cpf_validate(cpf) {
	var url = "https://auxilio.caixa.gov.br/api/sms/validarLogin";
	var headers = {
		Accept: "application/json",
		"Content-Type": "application/json; charset=utf-8",
		"User-Agent":
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:74.0) Gecko/20100101 Firefox/74.0",
	};
	var data = { cpf: cpf };

	var options = {
		method: "POST",
		url: url,
		headers: headers,
		body: JSON.stringify(data),
	};

	return new Promise(function (resolve, reject) {
		request(options, function (error, response, body) {
			if (error) {
				return reject(error);
			}
			return resolve(JSON.parse(body));
		});
	});
}

async function get_token_validade(cpf, token) {
	var url = "https://auxilio.caixa.gov.br/api/cadastro/validarLogin/" + cpf;
	var headers = {
		Accept: "application/json",
		"Content-Type": "application/json; charset=utf-8",
		"User-Agent":
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:74.0) Gecko/20100101 Firefox/74.0",
	};
	var data = { token: token };

	var options = {
		method: "PUT",
		url: url,
		headers: headers,
		body: JSON.stringify(data),
	};

	return new Promise(function (resolve, reject) {
		request(options, function (error, response, body) {
			if (error) {
				return reject(error);
			}
			return resolve(JSON.parse(body));
		});
	});
}
