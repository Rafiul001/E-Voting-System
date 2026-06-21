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

# Function to join a peer to a channel
join_peer_to_channel() {
    set_peer_env $1 $2 $3 $4

    peer channel join -b ./channel-artifacts/$5.block
}

# Function to get channel info for a peer
get_channel_info() {
    set_peer_env $1 $2 $3 $4

    peer channel getinfo -c $5
}

CHANNEL_PROFILE=VotingChannel
CHANNEL_NAME1=votingchannel


# Create Genesis Block:
export FABRIC_CFG_PATH=${PWD}/configtx
cd configtx/
configtxgen -profile $CHANNEL_PROFILE -outputBlock ../channel-artifacts/${CHANNEL_NAME1}.block -channelID $CHANNEL_NAME1
cd ..

# Join the orderer to all channels:
# # Orderer
echo "Joining"
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt
export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key

osnadmin channel join --channelID $CHANNEL_NAME1 --config-block ./channel-artifacts/${CHANNEL_NAME1}.block -o localhost:7053 --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY"

# Join the peers to the channel:
join_peer_to_channel localhost:8051 "ElectionCommissionMSP" "${PWD}/organizations/peerOrganizations/electionCommission.example.com/peers/peer0.electionCommission.example.com/tls/ca.crt" "${PWD}/organizations/peerOrganizations/electionCommission.example.com/users/Admin@electionCommission.example.com/msp" $CHANNEL_NAME1

join_peer_to_channel localhost:9051 "DistrictCommissionMSP" "${PWD}/organizations/peerOrganizations/districtCommission.example.com/peers/peer0.districtCommission.example.com/tls/ca.crt" "${PWD}/organizations/peerOrganizations/districtCommission.example.com/users/Admin@districtCommission.example.com/msp" $CHANNEL_NAME1

# Peer Channel Info:
get_channel_info localhost:8051 "ElectionCommissionMSP" "${PWD}/organizations/peerOrganizations/electionCommission.example.com/peers/peer0.electionCommission.example.com/tls/ca.crt" "${PWD}/organizations/peerOrganizations/electionCommission.example.com/users/Admin@electionCommission.example.com/msp" $CHANNEL_NAME1

get_channel_info localhost:9051 "DistrictCommissionMSP" "${PWD}/organizations/peerOrganizations/districtCommission.example.com/peers/peer0.districtCommission.example.com/tls/ca.crt" "${PWD}/organizations/peerOrganizations/districtCommission.example.com/users/Admin@districtCommission.example.com/msp" $CHANNEL_NAME1