---
page_type: sample
products:
- office-sp
languages:
- javascript
- typescript
extensions:
  contentType: samples
  technologies:
  - SharePoint Framework
  platforms:
  - React
  createdDate: 6/1/2020 12:00:00 AM
---

copy of: https://github.com/pnp/sp-dev-fx-webparts/blob/master/samples/react-my-groups

# My Groups
## Update
- Option to show all groups based on the selected letter or # (numbers)
- You can choose how many groups to display in the property pane.
- Ability to sort cards alphabetically or date the group was created.
- French language icluded.

## Summary

Using Microsoft Graph, this webpart generates all of the Office 365 groups that have been created in the SharePoint site.


![Grid Demo](./src/webparts/reactAllGroups/assets/All_Communities.png)


You can customize paging and sorting of items through the settings in the property pane:
![Property Pane Demo](./src/webparts/reactAllGroups/assets/PropertyPane_AllComm.png)

## Compability

![SPFx 1.10.0](https://img.shields.io/badge/SPFx-1.10.0-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-v10-green.svg)

## Applies to

* [SharePoint Framework](https://docs.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview)


## Solution

Solution|Author(s)
--------|---------
react-my-groups | Zach Roberts

## Version history

Version|Date|Comments
-------|----|--------
1.0|September 13, 2019|Initial release
1.1|June 1, 2020| Updated to SPFX 1.10.0
1.2|July 8, 2020| Added Grid Layout

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

* Clone this repository
* in the command line run:
  * `npm install`
  * `gulp bundle --ship`
  * `gulp package-solution --ship`
* Add the package to your app catalog
* Approve the Graph API permissions in the SharePoint admin center
* Add the webpart to your page


## Features

This web part lists all of the group sites created in the SharePoint site.

<img src="https://telemetry.sharepointpnp.com/sp-dev-fx-webparts/samples/react-my-groups" />

---


copie de: https://github.com/pnp/sp-dev-fx-webparts/blob/master/samples/react-my-groups

# Mes groupes
## Mise à jour
- Ajout de l'option de voir tous les groupes en fonction de la lettre ou du # (chiffres) sélectionnés.
- Vous pouvez choisir le nombre de groupes à afficher dans les paramètres.
- Il est possible de trier les groupes par date de création ou par ordre alphabétique.
- Le français a été ajouté.


## Résumé

À l’aide de Microsoft Graph, ce composant WebPart affiche tous les sites de groupe créés dans le site SharePoint.


![Grid Demo](./src/webparts/reactAllGroups/assets/All_Communities.png)


Vous pouvez personnaliser la pagination et le tri des éléments à l’aide des paramètres de la fenêtre des propriétés :
![Property Pane Demo](./src/webparts/reactAllGroups/assets/PropertyPane_AllComm.png)

## Compabilité

![1.10.0](https://img.shields.io/badge/SPFx-1.10.0-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-v10-green.svg)


## S’applique à ce qui suit :

* [SharePoint Framework](https://docs.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview)


## Solution

Solution|Autheur(s)
--------|---------
react-my-groups | Zach Roberts

## Historique des versions

Version|Date|Commentaires
-------|----|--------
1.0|13 septembre 2019|Version initiale
1.1|1er  juin 2020| Mise à jour vers SPFX 1.10.0
1.2|8 juillet 2020| Ajout de la disposition de grille

## Disclaimer

**LE PRÉSENT CODE EST FOURNI *TEL QUEL* SANS GARANTIE D’AUCUNE SORTE, EXPRESSE OU IMPLICITE, Y COMPRIS LES GARANTIES IMPLICITES D’ADAPTATION À UN USAGE PARTICULIER, DE QUALITÉ MARCHANDE OU D’ABSENCE DE CONTREFAÇON.**

---

## Chemin minimal vers l’excellence

* Clonez ce dépôt
* dans l’exécution de ligne de commande :
  * `npm install`
  * `gulp bundle --ship`
  * `gulp package-solution --ship`
* Ajoutez la trousse à votre catalogue d’applications.
* Approuvez les autorisations du Graph API dans le centre d’administration SharePoint.
* Ajoutez le composant WebPart à votre page.


## Fonctionnalités

Ce composant WebPart répertorie tous les sites de groupe créés dans le site SharePoint.

<img src="https://telemetry.sharepointpnp.com/sp-dev-fx-webparts/samples/react-my-groups" />

