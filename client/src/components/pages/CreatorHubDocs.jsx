import React from "react";
import { useSearchParams } from "react-router-dom"; // Use location to determine the active page
import { MDXProvider } from "@mdx-js/react";
import '../../css/creator-docs.css';
import Navbar from "../Navbar/Navbar";
import DocsSidenav from "../DocsSidenav/DocsSidenav"; // Import Sidenav component

// Import MDX files
import Intro from '../../docs/intro.mdx';
import MarketplaceRules from '../../docs/marketplace-rules.mdx';
import SubmissionGuidelines from '../../docs/submission-guidelines.mdx';
import CreateGuidelines from '../../docs/create-nft-blueprint.mdx'
import NftMintProtocol from '../../docs/metaplex-core.mdx';
import BlueprintToList from '../../docs/blueprint-to-marketplace.mdx';
import GeneralSiteRules from '../../docs/site-rules.mdx'
import CostsAndRewards from '../../docs/earnings-payouts.mdx';

import boohLogo from '../../assets/BoohLogo.svg'

const CreatorHubDocs = () => {

    const [searchParams] = useSearchParams();

    const docType = searchParams.get('page');

    // Map routes to their corresponding MDX components
    const docPages = {
        "intro": <Intro />,
        "marketplace": <MarketplaceRules />,
        "submission": <SubmissionGuidelines />,
        "create": <CreateGuidelines />,
        "metaplex-core": <NftMintProtocol />,
        "blueprint-to-marketplace": <BlueprintToList />,
        "site-rules": <GeneralSiteRules />,
        "costs-rewards": <CostsAndRewards />
    };

    return (
        <MDXProvider>
            <div className='d-flex justify-content-center' style={{ backgroundColor: 'rgb(30, 30, 30)' }}>
                <Navbar />
                <DocsSidenav />

                <div className='docs-body'>
                <div className='docs-container'>
                    {/* Render the correct MDX file based on the current route */}
                    {docPages[docType] || <Intro />} {/* Default to Intro if no match */}
                </div>
                </div>
            </div>
        </MDXProvider>
    );
};

export default CreatorHubDocs;