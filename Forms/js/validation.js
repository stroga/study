/*###############################################################
Реализовать инпут-пароль, в момент ввода проверять сложность вводимого пароля.
 - Сложность градировать по 5-бальной шкале. Показывать уровень сложности пароля под полем ввода.
 - Детали реализации функции проверки сложности пароля не интересны (можно считать количество символов, например).
 - Написать валидатор, который будет проверять верность вводимого email-а. 
 - Каждую ошибку сопровождать соответствующим сообщением. 
 - Возможные ошибки: не заполненное поле, не валидный email, уже занятый email. 
 - Предполагаем, что список занятых email-лов есть, и он хранится в глобальной переменной.


РЕАЛИЗАЦИЯ:
В данной реализации не предусмотренно:
 - Выполнение каких-либо действий при выключенном js;
 - Не предусмотрена работа с доменами, в названии которых есть символы кириллицы.
 

При реализации данного задания было использованно два подхода:
 - функциональный (функции);
 - прототипный (наследование).
Были предприняты попытки свести сообщения в объекты, чтобы
при смене языка проще было работать с текстом.
Также была предусмотрена валидация предзаполненных форм.
Условием проверки на надежность пароля условно была выбрана длина пароля с неповторяющимися символами.
Что касается кроссбраузерности, то функционал и внешний фид поддерживается
последними версиями "нормальных" браузеров и IE8+
################################################################*/
"use strict";
(function() {

    var activeSend = false;

    /*############################ Email validation ###############################*/
    //Email validation function
    (function() {
        //array of registered users emails
        var emails = ["BigEll@mail.ru.com", "tweak_3@ya.ru", "17_ice!2@angels.com.ua", "test@inbox.ru"];
        //messages for invalid input
        var messages = {
            emptyField: "Поле не может быть пустым",
            notValidForm: "Адрес электронной почты некорректен",
            usedEmail: "Данный адрес почты уже занят"
        };

        function ValidateEmail(emailForm) {
            this.emailForm = emailForm;
            this.submitInput = emailForm.querySelector("[name=email]");
            this.inputValue = this.submitInput.value;
            this.message = document.querySelector(".message_email");
            var self = this;

            bindEvent(this.submitInput, "focus", function(event) {
                addClass(self.message, "show")
                self.message.innerHTML = "";
            });

            bindEvent(this.submitInput, "blur", function(event) {
                if (self.submitInput.value.length === 0) {
                    self.message.innerHTML = messages.emptyField;
                } else if (self.isUsedEmail(self.submitInput.value)) {
                    self.message.innerHTML = messages.usedEmail;
                } else if (!self.validateEmail(self.submitInput.value)) {
                    self.message.innerHTML = messages.notValidForm;
                } else {
                    activeSend = true;
                }

            });

            bindEvent(this.submitInput, "keyup", function(event) {
                self.inputValue = this.value
            });

            bindEvent(this.emailForm, "submit", function(event) {
                if (!self.validateEmail(self.submitInput.value)) {
                    cancelDefaultEvent(event);
                    self.message.innerHTML = messages.notValidForm;
                }
                if (self.submitInput.value.length === 0) {
                    cancelDefaultEvent(event);
                    self.message.innerHTML = messages.emptyField;
                }
                if (self.isUsedEmail(self.submitInput.value)) {
                    cancelDefaultEvent(event);
                    self.message.innerHTML = messages.usedEmail;
                }
            });
        }

        ValidateEmail.prototype.validateEmail = function(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };

        ValidateEmail.prototype.isUsedEmail = function(email) {
            for (var i = 0; i < emails.length; i++) {
                if (emails[i] === email) {
                    return true;
                }
            }
            return false;
        };
        //email form initialization 
        var emailForm = new ValidateEmail(document.querySelector("[name=email_form]"));
    })();

    /*############################ Password verification ###############################*/

    // Password verification function 
    (function() {

        var PASSWORD_SAFETY_CONDITION = 5;

        //Object for storage input states
        var commandsRu = {
            state: "Надежность: ",
            lengthZeroFocus: "Пароль дожен содержать не менее 5 символов",
            lengthZeroBlur: "Поле не может быть пустым",
            lengthLessThenNeed: "Недостаточно надежный",
            reliable: "Надежный",
            differentSymbols: "Символы должны быть различны"
        };

        var input = document.querySelector("[name=password_field]");
        var confirm = document.querySelector("[name=password_confirm]");
        var message = document.querySelector(".not_match");
        var resultFirstText = document.querySelector(".message");
        var resultSecondText = document.querySelector(".second_message");
        var line = document.querySelector(".line");
        var form = document.querySelector("form");



        function showMessage() {
            line.style.display = "block";
            if (input.value.length === 0) {
                removeClass(resultSecondText, "second_message_show");
                addClass(resultSecondText, "second_message");
                removeClass(resultFirstText, "message");
                addClass(resultFirstText, "message_show");
                resultFirstText.innerHTML = commandsRu.lengthZeroFocus;
            }
        }
        //password verification (length of the password must be more than 5 different simbols)

        function check() {
            var str = input.value;
            var lengthOfInputContent = input.value.length;
            removeClass(resultFirstText, "message_show")
            addClass(resultFirstText, "message");
            if (lengthOfInputContent < PASSWORD_SAFETY_CONDITION) {
                resultFirstText.innerHTML = commandsRu.state;
                resultSecondText.className = "";
                addClass(resultSecondText, "second_message_show");
                resultSecondText.innerHTML = commandsRu.lengthLessThenNeed;
                if (lengthOfInputContent === 0) {
                    resultSecondText.innerHTML = commandsRu.lengthZeroBlur;
                    line.className = "";
                    addClass(line, "line_empty");
                } else if (lengthOfInputContent === 1) {
                    line.className = "";
                    addClass(line, "line20");
                } else if (lengthOfInputContent === 2) {

                    line.className = "";
                    addClass(line, "line40");
                } else if (lengthOfInputContent === 3) {
                    line.className = "";
                    addClass(line, "line60");
                } else {
                    line.className = "";
                    addClass(line, "line80");
                }
            } else if (lengthOfInputContent >= PASSWORD_SAFETY_CONDITION && isMatchOrNot(str)) {
                line.className = "";
                addClass(line, "line100");
                resultSecondText.className = "";
                addClass(resultSecondText, "second_message_show");
                resultSecondText.innerHTML = commandsRu.reliable;
            } else {
                line.className = "";
                addClass(line, "line80");
                resultSecondText.innerHTML = commandsRu.differentSymbols;
            }
        }

        //is password field has the equal symbols?

        function isMatchOrNot(strOfInput) {
            var arrOfSameElements = [];
            var firstElem = strOfInput[0];
            for (var i = 0; i < strOfInput.length; i++) {
                if (strOfInput[i] === firstElem) {
                    arrOfSameElements.push(strOfInput[i]);
                } else {
                    return true;
                }
                if (arrOfSameElements.length === strOfInput.length) {
                    return false
                }
            }
        }

        function changeSendAbility(event) {
            cancelDefaultEvent(event);
            check();
            if (input.value.length >= PASSWORD_SAFETY_CONDITION && isMatchOrNot(input.value) && isTheSamePassword()) {
                this.submit();
            }
        }

        //are password input and password confirmation input match?

        function isTheSamePassword() {
            if (confirm.value !== input.value) {
                removeClass(message, "not_match");
                addClass(message, "not_match_show");
                return false;
            } else if (activeSend === true) {
                return true;
            }
        }

        function hideConfirmMessage() {
            removeClass(message, "not_match_show");
            addClass(message, "not_match");
        }

        bindEvent(confirm, "focus", hideConfirmMessage);
        bindEvent(form, "submit", changeSendAbility);
        bindEvent(input, "keyup", check);
        bindEvent(input, "focus", showMessage);
        bindEvent(input, "blur", check);
    })();

})();