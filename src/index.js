import api from './../api/api.js';
import css from "./style.css";

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
    var self = this;

    //Declaração dos Observables

    self.todoForm = ko.observable(true);
    self.buttonDisable = ko.observable(true);

    self.buttonActive = ko.observable(false);

    self.firstName = ko.observable("").extend({ required: true});

    self.lastName = ko.observable("").extend({
        required: {message: 'Preencha o sobrenome*'}
    });

    self.ddd = ko.observable("").extend({required: true});

    self.phone = ko.observable("").extend({
        required: {message: 'Preencha o telefone*'}, 
        number: {message: 'Digite apenas numeros*'}
    });

    self.cep = ko.observable("").extend({
        required: {message: 'Preencha o CEP*'}, 
        number: {message: 'Digite apenas numeros*'}
    });

    self.address = ko.observable("").extend({required: true});

    self.number = ko.observable("").extend({required: true});
        
    self.complement = ko.observable("");
        
    self.district = ko.observable("").extend({required: true});
        
    self.city = ko.observable("").extend({required: true});
        
    self.state = ko.observable("").extend({
        required: true,
        maxLength: 2
    });

    self.hasDistrict = ko.observable();
    self.hasCity = ko.observable();
    self.hasState = ko.observable();
    self.hasAddress = ko.observable();

    //Botao para validar o CEP
    self.validateCep = function(){
        
        //Pega valores fornecidos pela API
        api.getCep(self.cep()).then((result) => {
            console.log(result);
            console.log(result.erro);
            
            //Se o CEP inserido for retornado válido da API, preenche os dados automáticamente nos inputs
            if(result.erro == undefined){
                console.log("Deu certo");
                limpaCamposCep();
                self.address(result.logradouro);
                self.district(result.bairro);
                self.city(result.localidade);
                self.state(result.uf);
                DisableTrueOrFalse(true);

            //Se não for retornado válido, limpa os inputs e habilita para preenchimento manual
            }else{
                console.log("Deu erro");
                limpaCamposCep();
                DisableTrueOrFalse(false);
            };
        });
    };
    //Verifica se os campos obrigatórios estão vazios para habilitar ou desabilitar o botao
    function inputsVerification(){
        if(self.firstName() && self.lastName() && self.ddd() && self.phone() && self.cep() && self.address() && self.number() && self.district() && self.city() && self.state()){

            //Esconde botão desabilitado e dá show no botão ativo
            self.buttonDisable(false);
            self.buttonActive(true);
        }else{
            //Da show no botão desabilitado e esconde o botão ativo
            self.buttonDisable(true);
            self.buttonActive(false);
        };
    }

    //Cria um evento para sempre ouvir os movimentos dos inputs
    var inputs = document.querySelectorAll("input");

    inputs.forEach(function(input) {
        input.addEventListener("mouseleave", function() {
            inputsVerification();
        });
    });

    self.EnviarDados = function(){

        //Imprime o objeto data que recebe cada um dos valores dos inputs
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
    };

    //Zera os observables dos inputs para nova busca
    function limpaCamposCep(){
        self.address("").district("").city("").state("");
    };

    //Define valor de true ou false para travar os inputs ao buscar o CEP
    function DisableTrueOrFalse(valor){
        self.hasAddress(valor).hasDistrict(valor).hasCity(valor).hasState(valor);
    };
}

const appViewModel = new AppViewModel();

// can be used in the navigation console
window.appViewModel = appViewModel;

// Activates knockout.js
ko.validation.init();
ko.applyBindings(appViewModel);
