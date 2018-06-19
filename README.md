# Описание приложения

Данное приложение создано при помощи генератора express-generator в ходе прослушивания семинара "Разворачиваем Node.JS приложение в Azure на базе Linux App Service" от Microsoft

Перснальная ссылка на просмотр семинара присылается после регистрации на семинар.

## Работа с Microsoft Azure

### Проблема

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

### Решение

В панели управления Azure Cloud в настоящее время можно использовать движок Kudu.
> **kudu**
> Kudu is the engine behind git/hg deployments, WebJobs, and various other features in Azure Web Sites. It can also run outside of Azure.

Чтобы посмотреть текущий скрипт развертывания, нужно в панели проекта перейти по пути:
> Проект > Средства разработки > Дополнительные инструменты > Вперед
и далее либо через файловый браузер по ссылке Files, либо открыв Debug Console > Bash, перейти к файлу по пути:

```bash
/home/site/deployments/tools/deploy.sh
```

Файл ".deployment", видимо, по умолчанию отсутствует, что, в приниципе, соответствует алгоритмы развертывания в Kudu:
When deploying a git repository via Kudu, the rules for picking a specific project are as follows:

1. If there's a .deployment file at the root of the repository go to step 4, otherwise go to the next step.
2. Scan for solution files, if there's multiple solutions, fail, if there's 1 solution file go to next step, if none, go to step 6.
3. Now that we have a solution, pick the first website or WAP in that solution and deploy it, if there's none, then fail.
4. Find the target project file, if there's multiple projects, fail, if there's 1 project file, deploy it, otherwise go to next step.
5. look for a website project in the specified folder (by finding a solution that has a website with the same path), if more than one, fail, otherwise deploy the website project.
6. Find the target WAP, if there's none then Xcopy deploy all the repository files (excluding .git and .hg) to the web root.

Источник: [Project Kudu, Customizing deployments][2].

[1]: https://linuxacademy.com/howtoguides/posts/show/topic/17186-understanding-key-difference-between-azure-asm-and-azure-arm
[2]: [https://github.com/projectkudu/kudu/wiki/Customizing-deployments