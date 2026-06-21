#!/bin/bash

# Function to set environment variables for a peer
set_peer_env() {
    export FABRIC_CFG_PATH=${PWD}/configtx/
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_ADDRESS=$1
    export CORE_PEER_LOCALMSPID=$2
    export CORE_PEER_TLS_ROOTCERT_FILE=$3
    export CORE_PEER_MSPCONFIGPATH=$4
}

export CC_NAME=electioncc
export CHANNEL_NAME=votingchannel

set_peer_env localhost:8051 "ElectionCommissionMSP" "${PWD}/organizations/peerOrganizations/electionCommission.example.com/peers/peer0.electionCommission.example.com/tls/ca.crt" "${PWD}/organizations/peerOrganizations/electionCommission.example.com/users/Admin@electionCommission.example.com/msp"

# peer chaincode invoke \
#     -o localhost:7050 \
#     --ordererTLSHostnameOverride orderer.example.com \
#     --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
#     -C ${CHANNEL_NAME} \
#     -n ${CC_NAME} \
#     --peerAddresses localhost:8051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/electionCommission.example.com/peers/peer0.electionCommission.example.com/tls/ca.crt" \
#     --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/districtCommission.example.com/peers/peer0.districtCommission.example.com/tls/ca.crt" \
#     -c '{"function":"Initialize","Args":["ELPID002"]}'

peer chaincode invoke \
    -o localhost:7050 \
    --ordererTLSHostnameOverride orderer.example.com \
    --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
    -C ${CHANNEL_NAME} \
    -n ${CC_NAME} \
    --peerAddresses localhost:8051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/electionCommission.example.com/peers/peer0.electionCommission.example.com/tls/ca.crt" \
    --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/districtCommission.example.com/peers/peer0.districtCommission.example.com/tls/ca.crt" \
    -c '{"function":"StartElection","Args":["ELPID002"]}'

# peer chaincode invoke \
#     -o localhost:7050 \
#     --ordererTLSHostnameOverride orderer.example.com \
#     --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
#     -C ${CHANNEL_NAME} \
#     -n ${CC_NAME} \
#     --peerAddresses localhost:8051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/electionCommission.example.com/peers/peer0.electionCommission.example.com/tls/ca.crt" \
#     --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/districtCommission.example.com/peers/peer0.districtCommission.example.com/tls/ca.crt" \
#     -c '{"function":"FinishElection","Args":["ELPID002"]}'

# set_peer_env localhost:9051 "DistrictCommissionMSP" "${PWD}/organizations/peerOrganizations/districtCommission.example.com/peers/peer0.districtCommission.example.com/tls/ca.crt" "${PWD}/organizations/peerOrganizations/districtCommission.example.com/users/Admin@districtCommission.example.com/msp"

# peer chaincode invoke \
#     -o localhost:7050 \
#     --ordererTLSHostnameOverride orderer.example.com \
#     --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
#     -C ${CHANNEL_NAME} \
#     -n ${CC_NAME} \
#     --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/districtCommission.example.com/peers/peer0.districtCommission.example.com/tls/ca.crt" \
#     -c '{"function":"Initialize","Args":["ELPID005"]}'