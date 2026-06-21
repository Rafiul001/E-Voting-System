#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
    	-e "s/\${ORGC}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORGC}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

# ElectionCommission
ORG=electionCommission
ORGC=ElectionCommission
P0PORT=8051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/electionCommission.example.com/tlsca/tlsca.electionCommission.example.com-cert.pem
CAPEM=organizations/peerOrganizations/electionCommission.example.com/ca/ca.electionCommission.example.com-cert.pem

echo "$(json_ccp $ORG $ORGC $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/electionCommission.example.com/connection-electionCommission.json
echo "$(yaml_ccp $ORG $ORGC $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/electionCommission.example.com/connection-electionCommission.yaml


# DistrictCommission
ORG=districtCommission
ORGC=DistrictCommission
P0PORT=9051
CAPORT=9054
PEERPEM=organizations/peerOrganizations/districtCommission.example.com/tlsca/tlsca.districtCommission.example.com-cert.pem
CAPEM=organizations/peerOrganizations/districtCommission.example.com/ca/ca.districtCommission.example.com-cert.pem

echo "$(json_ccp $ORG $ORGC $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/districtCommission.example.com/connection-districtCommission.json
echo "$(yaml_ccp $ORG $ORGC $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/districtCommission.example.com/connection-districtCommission.yaml
