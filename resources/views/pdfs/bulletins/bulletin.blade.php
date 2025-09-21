<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="{{public_path('fichiers/images/logo.png')}}" type="image/x-icon">
    <title>Bulletin</title>
    <style>
        * {
            font-family: "Poppins";
        }

        #header {
            width: 100%;
            border-collapse: collapse;
            /* border-bottom: 1px solid #000; */
            padding-bottom: 10px !important;
        }

        #logo {
            width: 100px;
            height: 100px;
        }

        #block {
            width: 100%;
            /* text-align: center; */
            margin: 0 auto;
        }

        #block-content {
            width: 100%;
            margin: 0 auto;
            background-color: #dccee5;
            border-radius: 10px;
            border: solid 2px #f6f6f6 !important;
            padding: 10px;
        }

        .school-contact,
        .school-slogan {
            font-weight: bold;
        }

        #souscriptionInFos {
            display: flex !important;
            justify-content: space-between !important;
        }

        .souscription_number {
            background-color: #000 !important;
            color: #fff !important;
            padding: 10px !important;
            border-radius: 10px !important;
            border: 3px solid #fff;
        }

        #resteBlock {
            background-color: #f6f6f6;
            border: #000 solid 2px;
            border-radius: 0px 10px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            padding: 1px 5px;
        }

        .badge {
            background-color: #fff;
            padding: 2px 5px !important;
            border: solid 2px #f6f6f6;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>

<body class="p-0 m-0">
    <div class="container-fluid mx-0 px-0">
        <div id="block">
            <div id="block-content">
                <!-- HEADER -->
                <table id="header">
                    <tr>
                        <!-- Logo gauche -->
                        <td style="width: 25%; text-align: left;">
                            <img src="{{ public_path('fichiers/images/logo.png') }}"
                                id="logo"
                                alt="Logo de l'école"
                                style="max-width: 100px; height: auto;">
                        </td>

                        <!-- Texte centre -->
                        <td style="width: 50%; text-align: center;">
                            <p class="school-description text-upercase my-2" style="text-transform: uppercase!important;">République du Bénin</p>
                            <h1 class="school-name" style="margin: 0; font-size: 18px; text-transform:uppercase">{{$apprenant->school?->raison_sociale}}</h1>
                            <h3 style="margin: 2px!important;">{{$apprenant->school?->description}}</h3>
                            <br>
                            <p class="school-contact" style="margin: 0;">Tel: {{$apprenant->school?->phone}}</p>
                            <p class="school-slogan" style="margin: 0;">{{$apprenant->school?->slogan}}</p>
                        </td>

                        <!-- Logo reçu -->
                        <td style="width: 25%; text-align: right;">
                            <img src="{{ public_path('fichiers/images/newsletter.jpg') }}"
                                id="recuImg"
                                alt="Reçu"
                                style="max-width: 100px; height: auto;">
                        </td>
                    </tr>
                </table>

                <hr>
                <!-- Apprenant infos -->
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <!-- Colonne gauche -->
                        <td style="width: 50%; text-align: left; vertical-align: top;">
                            <div class="border rounded">
                                <p class="apprenant-name"><strong class="badge"> Nom</strong> : <strong style="margin-left:20px;display:inline; border-bottom:1px dashed #000; width:100%;"> {{$apprenant->firstname}}</strong></p>
                                <p class="apprenant-name"><strong class="badge"> Prénom</strong> : <strong style="margin-left:20px;display:inline; border-bottom:1px dashed #000; width:100%;"> {{$apprenant->lastname}}</strong></p>
                                <p class="apprenant-name"><strong class="badge"> Date de naissance</strong> : <strong style="margin-left:20px;display:inline; border-bottom:1px dashed #000; width:100%;"> {{\Carbon\carbon::parse( $apprenant->date_naissance)->locale('fr')->isoFormat('D MMMM YYYY')}} </strong></p>

                            </div>
                        </td>

                        <!-- Colonne milieu -->
                        <td style="width: 25%; text-align: left; vertical-align: top;">
                            <p class="apprenant-name"><strong class="badge"> Classe</strong> : <strong style="margin-left:20px;display:inline; border-bottom:1px dashed #000; width:100%;"> {{$apprenant->classe?->libelle}} - {{$apprenant->serie?->libelle}}</strong></p>
                            <p class="apprenant-name"><strong class="badge"> Effectif</strong> : <strong style="margin-left:20px;display:inline; border-bottom:1px dashed #000; width:100%;"> {{$apprenant->classe?->apprenants->count()}}</strong></p>
                            <p class="apprenant-name"><strong class="badge"> Statut</strong> : <strong style="margin-left:20px;display:inline; border-bottom:1px dashed #000; width:100%;"> {{$apprenant->statut}}</strong></p>
                        </td>

                        <!-- Colonne droite -->
                        <td style="width: 25%; text-align: left; vertical-align: center; align-items:center!important">
                            <p class="apprenant-name"><strong class="badge"> Lieu de naissance</strong> : <strong style="margin-left:20px;display:inline; border-bottom:1px dashed #000; width:100%;"> {{$apprenant->lieu_naissance}}</strong></p>
                            <p class="apprenant-name"><strong class="badge"> Sexe</strong> : <strong style="margin-left:20px;display:inline; border-bottom:1px dashed #000; width:100%;"> {{$apprenant->sexe}}</strong></p>
                            <p class="apprenant-name"><strong class="badge"> Année scolaire</strong> : <strong style="margin-left:20px;display:inline; border-bottom:1px dashed #000; width:100%;"> {{$apprenant->period}}</strong></p>
                        </td>
                    </tr>
                </table>

                <br>
                <hr class="" style="width: 100%;color:#f6f6f6">
                <br>

                <!-- Info souscription -->
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="width:100%!important;background-color:#f6f6f6;text-align:center;">
                        <td style="padding:10px!important;border-radius:10px!important">BULLETIN DE NOTES DU <span style="background-color: #000;color:white;padding:5px;border-radius:10px">{{$trimestre->libelle}}</span> </td>
                    </tr>
                    <br>
                    <tr style="text-align: center;">
                        <p class="">En cours de developpement .....</p>
                    </tr>
                </table>

                <!--  -->
                <!-- <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">DISCIPLINES</th>
                            <th scope="col">Coef</th>
                            <th scope="col">Moy Inter</th>
                            <th scope="col">Devoir n° 1</th>
                            <th scope="col">Devoir n° 2</th>
                            <th scope="col">Moy/20</th>
                            <th scope="col">Moy Coef</th>
                            <th scope="col">Moy faible</th>
                            <th scope="col">Moy forte</th>
                            <th scope="col">Appréciation du prof</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($apprenant->matieres as $matiere)
                        <tr>
                            <th scope="row">{{$matiere->libelle}}</th>
                            <td>{{$matiere->coefficient}}</td>
                            <td>{{$matiere->moyenne_interro}}</td>
                            @foreach($matiere->devoirs as $devoir)
                            <td>{{$devoir->note}}</td>
                            @endforeach
                            <td>{{number_format($matiere->moyenne,2,","," ")}}</td>
                            <td>{{$matiere->moyenne_coefficie}}</td>
                            <td>{{$matiere->moyenne_failble}}</td>
                            <td>{{$matiere->moyenne_forte}}</td>
                            <td><p></p></td>
                        </tr>
                        @empty
                        <p>Aucune matière trouvée!</p>
                        @endforelse
                    </tbody>
                </table> -->
            </div>
        </div>
    </div>
</body>

</html>