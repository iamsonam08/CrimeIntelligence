/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActivePage = 'dashboard' | 'crime-map' | 'criminal-network' | 'predictions' | 'alerts' | 'settings';

export interface NavigationItem {
  id: ActivePage;
  label: string;
  iconName: string;
}
