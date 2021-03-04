import api from './../api/api.js';
import css from "./style.css";

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
    var self = this;

    //Declaração dos Observables

    self.firstName = ko.observable("").extend({ 
        required: {message: 'Preencha o nome*'}
    });

    self.lastName = ko.observable("").extend({
        required: {message: 'Preencha o sobrenome*'}
    });

    self.ddd = ko.observable("").extend({
        required: {message: 'Preencha o DDD*'}});

    self.phone = ko.observable("").extend({
        required: {message: 'Preencha o telefone*'}, 
        number: {message: 'Digite apenas numeros*'}
    });

    self.cep = ko.observable("").extend({
        required: {message: 'Preencha o CEP*'}, 
        number: {message: 'Digite apenas numeros*'},
        pattern:{
            params: /[0-9]{5}[0-9]{3}/,
            message: 'Digite corretamente o CEP'
        },
        minLength:{
            params: 8,
            message: 'Informe 8 digitos'
        },
        maxLength:{
            params: 8,
            message: 'Máximo de 8 digitos'
        }
    });

    self.address = ko.observable("").extend({
        required: {message: 'Digite o endereço*'}
    });

    self.number = ko.observable("").extend({
        required: {message: 'Digite o número*'}
    });
        
    self.district = ko.observable("").extend({
        required: {message: 'Digite o bairro*'}});
        
    self.city = ko.observable("").extend({
        required: {message: 'Digite a cidade*'}});
        
    self.state = ko.observable("").extend({
        required: {message: 'Digite o UF*'},
        maxLength: 2
    });

    self.buttonDisable = ko.observable(true);
    self.complement = ko.observable("");

    self.hasDistrict = ko.observable();
    self.hasCity = ko.observable();
    self.hasState = ko.observable();
    self.hasAddress = ko.observable();
    self.cepIncorreto = ko.observable(false);

    //Botao para validar o CEP
    self.validateCep = function(){
        
        //Pega valores fornecidos pela API
        api.getCep(self.cep()).then((result) => {
  
            //Se o CEP inserido for retornado válido da API, preenche os dados automáticamente nos inputs
            if(result.erro == undefined){
                limpaCamposCep();
                self.address(result.logradouro);
                self.district(result.bairro);
                self.city(result.localidade);
                self.state(result.uf);
                DisableTrueOrFalse(true);
                self.cepIncorreto(false);

            //Se não for retornado válido, limpa os inputs e habilita para preenchimento manual
            }else{
                limpaCamposCep();
                DisableTrueOrFalse(false);
                self.cepIncorreto(true);
            };
        });
    };

    //Cria um evento para sempre ouvir os movimentos dos inputs
    var inputs = document.querySelectorAll("input");

    inputs.forEach(function(input) {
        input.addEventListener(("blur", "keyup"), function() {
            verificaInputs();
        });
    });

    //Botão de Enviar
    self.EnviarDados = function(){
        //Faz uma validação se os campos estão preenchidos corretamente e 
        //Imprime o objeto data que recebe cada um dos valores dos inputs
        if (appViewModel.errors().length === 0) {
            var data = {
                'firstName': self.firstName(),
                'lastName' : self.lastName(),
                'ddd': self.ddd(),
                'phone' : self.phone(),
                'cep': self.cep(),
                'address' : self.address(),
                'number' : self.number(),
                'complement' : self.complement(),
                'district': self.district(),
                'city' : self.city(),
                'state': self.state()
            }
            console.log(data);
        }else{
            alert('Preencha corretamente o formulário!')
        }
    };

    //Zera os observables dos inputs para nova busca
    function limpaCamposCep(){
        self.address("").district("").city("").state("");
    };

    //Define valor de true ou false para travar os inputs ao buscar o CEP
    function DisableTrueOrFalse(valor){
        self.hasAddress(valor).hasDistrict(valor).hasCity(valor).hasState(valor);
    };

    //Verifica se existem erros no validations e retorna botão habilitado ou não
    function verificaInputs() {
        if (appViewModel.errors().length === 0) {
            console.log('Obrigado');
            self.buttonDisable(false);
        }
        else {
            appViewModel.errors.showAllMessages();
            console.log('Preencha o formulário corretamente');
            self.buttonDisable(true);
        }
    }
}

const appViewModel = new AppViewModel();

// can be used in the navigation console
window.appViewModel = appViewModel;

// Activates knockout.js
ko.applyBindings(appViewModel);
appViewModel.errors = ko.validation.group(appViewModel);
