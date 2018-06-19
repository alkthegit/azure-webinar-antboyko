# Описание приложения

Данное приложение создано при помощи генератора express-generator в ходе прослушивания семинара "Разворачиваем Node.JS приложение в Azure на базе Linux App Service" от Microsoft

Перснальная ссылка на просмотр семинара присылается после регистрации на семинар.

## Работа с Microsoft Azure

### Проблема 1

В ходе работы над тестовым проектом ведущий показывает примеры работы с командной строкой Azure - Azure CLI для Linux.
Он работает с версией Azure CLI 1.0 переключая ее в режим управления службами asm - Azure Service Manager.
В командной строке Linux это команда **azure**. 

Однако на момент прослушивания семинара (13.06.2018) в документации к Azure от Microsoft рекомендовано использовать версию Azure CLI 2.0
В командной строке Linux это команда **az**.

Сложность в том, что некоторые команды, которые показывает ведущий, выполнить в новой версии нельзя, так как теперь основным режимом работы Microsoft Azure является менеджер ресурсов Azure arm - Azure Resource Manager. При этом ASM все еще поддерживается.
Например, в az (новый подход) невозможно выполнить команду, создающую сценарии развертывания проекта, предлагаемую автором:

```bash
azure config deploymentscript
```

Эти два режима основаны на разных подходах к облачным сервисам приложения/платформ/инфраструктуры. Разница между ними рассматривается, например, в статье [Understanding key difference between Azure ASM and Azure ARM][1].

### Решение Прблемы 1

В панели управления Azure Cloud в настоящее время можно использовать движок Kudu.
> **kudu**
> Kudu is the engine behind git/hg deployments, WebJobs, and various other features in Azure Web Sites. It can also run outside of Azure.

Чтобы посмотреть текущий скрипт развертывания, нужно в панели проекта перейти по пути:
> Проект > Средства разработки > Дополнительные инструменты > Вперед
и далее либо через файловый браузер по ссылке Files, либо открыв Debug Console > Bash, перейти к файлу по пути:

```bash
/home/site/deployments/tools/deploy.sh
```

Источник: [Project Kudu, Customizing deployments][2].

Файл ".deployment", видимо, по умолчанию отсутствует, что, в приниципе, соответствует алгоритмы развертывания в Kudu:
When deploying a git repository via Kudu, the rules for picking a specific project are as follows:

1. If there's a .deployment file at the root of the repository go to step 4, otherwise go to the next step.
2. Scan for solution files, if there's multiple solutions, fail, if there's 1 solution file go to next step, if none, go to step 6.
3. Now that we have a solution, pick the first website or WAP in that solution and deploy it, if there's none, then fail.
4. Find the target project file, if there's multiple projects, fail, if there's 1 project file, deploy it, otherwise go to next step.
5. look for a website project in the specified folder (by finding a solution that has a website with the same path), if more than one, fail, otherwise deploy the website project.
6. Find the target WAP, if there's none then Xcopy deploy all the repository files (excluding .git and .hg) to the web root.

### Проблема 2 (Связана с Проблемой 1)

Проблема связана с ручным самодельным или измененным исходным сценарием развертывания, которые можно добавить в проект самостоятельно, либо воспользовавшись местоположением файла deploy.sh из Решения проблемы 1.
Проблема связана с символами конца строки в Windows (где может вестись разработка) и Unix (где происходит развертывание в Azure). Символы Windows - "CRLF", Unix - "LF". Из-за этого различия при выполнения сценария развертывания deploy.sh выдается ошибка (с доп. информацией):

```bash
remote: Running custom deployment command...
remote: Running deployment command...
remote: deploy.sh: line 2: $'\r': command not found
remote: deploy.sh: line 7: $'\r': command not found
remote: deploy.sh: line 10: $'\r': command not found
remote: deploy.sh: line 11: syntax error near unexpected token `$'{\r''
remote: deploy.sh: line 11: `exitWithMessageOnError () {
remote: '
remote:
remote: App container will begin restart within 10 seconds.
remote: Error - Changes committed to remote repository but deployment to website failed.
To https://alexander-k@webinar-azure.scm.azurewebsites.net:443/webinar-azure.git
   6125e07..d5a8e89  master -> master
```

### Решение Проблемы 2

Для решения данной проблемы нужно просто пересохранить файлы с символами конца строки для Unix. В Visual Studio Code это делается крайне просто выбором переключателя в строке состояния внизу окна редактора:

![Переключатель][crlf_switch]

В итоге, для создания собственного сценария развертывания для своего приложения в Azure, необходимо дополнить свой проект (корневую папку) двумя файлами:

    - .deployment
    - deploy.sh

Содержимое файла .deployment:

```bash
[config]
command=deploy.sh
```

Содержимое файла deploy.sh определяется по необходимости.

[1]: https://linuxacademy.com/howtoguides/posts/show/topic/17186-understanding-key-difference-between-azure-asm-and-azure-arm
[2]: [https://github.com/projectkudu/kudu/wiki/Customizing-deployments
[crlf_switch]: ./guide/crlf_switch.png "Переключатель выделен зеленым маркером"