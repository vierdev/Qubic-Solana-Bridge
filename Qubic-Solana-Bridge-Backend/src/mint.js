import {
  createFungible,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  getSplAssociatedTokenProgramId,
  mintTokensTo,
  mplToolbox,
} from "@metaplex-foundation/mpl-toolbox";
import {
  generateSigner,
  percentAmount,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes/index.js";
import { InvalidPublicKeyError } from "@metaplex-foundation/umi-public-keys";
import dotenv from "dotenv";
import { PublicKey } from "@solana/web3.js";
dotenv.config();

// Create the wrapper function
export const createAndMintTokens = async (amount, userAddress) => {
  try {
    const privKey = process.env.SOLANA_PRIV;
    const umi = createUmi("https://api.devnet.solana.com")
      .use(mplTokenMetadata())
      .use(mplToolbox())
      .use(irysUploader());
    const keyPair = umi.eddsa.createKeypairFromSecretKey(
      new Uint8Array(bs58.decode(privKey))
    );
    umi.use(keypairIdentity(keyPair));
    const metadata = {
      name: "The WQubic Coin",
      symbol: "WQUBIC",
      description: "The Qubic Coin is a token created on the Solana blockchain",
      image:
        "https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fbafkreih44n5jgqpwuvimsxzroyebjunnm47jttqusb4ivagw3vsidil43y.ipfs.nftstorage.link&anim=true&fit=cover&width=128&height=128", // Either use variable or paste in string of the uri.
    };
    const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
      throw new Error(err);
    });
    // const mintSigner = generateSigner(umi);
    // console.log('mintSigner: ', mintSigner);
    const mintSigner = "Eseh4QUZhjKUjnLzjTnZkevVYVmnse21LDfYPf7bcCSK";
    console.log("userAddress:", userAddress);

    const userPublicKey = publicKey(userAddress);

    console.log("userPublicKey:", userPublicKey);

    const createMintIx = await createFungible(umi, {
      mint: mintSigner,
      name: "The Qubic Coin",
      uri: metadataUri, // we use the `metadataUri` variable we created earlier that is storing our uri.
      sellerFeeBasisPoints: percentAmount(0),
      decimals: 9, // set the amount of decimals you want your token to have.
    });
    const createTokenIx = createTokenIfMissing(umi, {
      mint: mintSigner,
      owner: userPublicKey,
      ataProgram: getSplAssociatedTokenProgramId(umi),
    });
    const mintTokensIx = mintTokensTo(umi, {
      mint: mintSigner,
      token: findAssociatedTokenPda(umi, {
        mint: mintSigner,
        owner: userPublicKey,
      }),
      amount: BigInt(amount * 1000),
    });
    // chain the instructions together with .add() then send with .sendAndConfirm()

    // const tx = await createMintIx
    //   .add(createTokenIx)
    //   .add(mintTokensIx)
    //   .sendAndConfirm(umi);
    const tx = await createTokenIx.add(mintTokensIx).sendAndConfirm(umi);

    // finally we can deserialize the signature that we can check on chain.
    const signature = base58.deserialize(tx.signature)[0];

    console.log("signature:", signature);

    // Log out the signature and the links to the transaction and the NFT.
    // Explorer links are for the devnet chain, you can change the clusters to mainnet.
    return { success: true, signature };
  } catch (error) {
    if (error instanceof InvalidPublicKeyError) {
      console.error(`Invalid public key: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${error}`);
    }

    // After catching the error, you can log it and move on.
    // Your backend will continue running without crashing.
    return; // or you can send an error response if it's a web app
  }
};

// run the wrapper function
