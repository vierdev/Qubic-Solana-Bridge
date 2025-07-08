'use client';
import { Navbar as HeroUINavbar, NavbarContent, NavbarBrand } from '@heroui/navbar';
import NextLink from 'next/link';
import Image from 'next/image';
import { BaseWalletMultiButton } from '@solana/wallet-adapter-react-ui';

import QubicConnect from '@/components/QbuicConnect/ConnectLink';

const LABELS = {
  'change-wallet': 'Change wallet',
  connecting: 'Connecting ...',
  'copy-address': 'Copy address',
  copied: 'Copied',
  disconnect: 'Disconnect',
  'has-wallet': 'Connect Sol Wallet',
  'no-wallet': 'Select Sol Wallet',
} as const;

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth='xl' position='sticky'>
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand as='li' className='gap-3 max-w-fit'>
          <NextLink className='flex justify-start items-center gap-1' href='/'>
            <Image src='/QubicAssets/logo.svg' alt='logo' width={20} height={20} />
            <p className='font-bold text-xl'>Qubic Solana Bridge</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>
      <QubicConnect />
      <BaseWalletMultiButton labels={LABELS} />

      {/* <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu> */}
    </HeroUINavbar>
  );
};
